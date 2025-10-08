import React, { useState } from 'react';
import { Search, Settings, Loader2, TrendingUp, Sparkles, Filter, Hash, ThumbsUp, ThumbsDown, MessageSquare, Send, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const SimilarityChecker = () => {
  const [searchMode, setSearchMode] = useState('text'); // 'text' or 'id'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestionCode, setSuggestionCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [expandedResults, setExpandedResults] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [feedbackGiven, setFeedbackGiven] = useState({});
  
  // API Configuration - UPDATE THESE URLs
  const API_BASE_URL = 'https://8000-01k6w02czv93bhave2xgrvw6gv.cloudspaces.litng.ai'; // Change to your API URL
  
  const [settings, setSettings] = useState({
    committeeCode: '',
    status: '',
    isDuplicated: null,
    startDate: '',
    endDate: '',
    threshold: 0.0,
    topK: 10,
    alpha: 0.5
  });

  // Convert to Persian numbers
  const toPersianNum = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  // Search function
  const handleSearch = async () => {
    if (searchMode === 'text' && (!title.trim() || !description.trim())) {
      setError('لطفاً عنوان و شرح پیشنهاد را وارد کنید');
      return;
    }
    if (searchMode === 'id' && !suggestionCode.trim()) {
      setError('لطفاً کد پیشنهاد را وارد کنید');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setResults(null);
    
    try {
      const endpoint = searchMode === 'text' 
        ? `${API_BASE_URL}/v1/detector/similarity-detection-without-id`
        : `${API_BASE_URL}/v1/detector/similarity-detection-by-id`;
      
      const requestBody = searchMode === 'text' 
        ? {
            title: title.trim(),
            description: description.trim(),
            'committee_code': settings.committeeCode || undefined,
            'status': settings.status || undefined,
            'is-duplicated': settings.isDuplicated,
            'start-date': settings.startDate || undefined,
            'end-date': settings.endDate || undefined,
            'threshold': settings.threshold,
            'top-k': settings.topK,
            'alpha': settings.alpha
          }
        : {
            code: suggestionCode.trim(),
            'committee_code': settings.committeeCode || undefined,
            'status': settings.status || undefined,
            'is-duplicated': settings.isDuplicated,
            'start-date': settings.startDate || undefined,
            'end-date': settings.endDate || undefined,
            'threshold': settings.threshold,
            'top-k': settings.topK,
            'alpha': settings.alpha
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`خطا در دریافت اطلاعات: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      
    } catch (err) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Feedback API call
  const handleFeedback = async (operationId, index, feedbackType) => {
    try {
      const statusValue = feedbackType === 'positive' ? 1 : feedbackType === 'negative' ? -1 : 0;
      
      const response = await fetch(`${API_BASE_URL}/v1/detector/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'operation-id': operationId,
          'index': index,
          'status': statusValue
        })
      });

      const data = await response.json();
      
      if (data.type === 'successful') {
        setFeedbackGiven({
          ...feedbackGiven,
          [`${operationId}-${index}`]: feedbackType
        });
      }
      
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  // Comment API call
  const handleCommentSubmit = async (operationId, index) => {
    const comment = commentInputs[`${operationId}-${index}`];
    if (!comment?.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/detector/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'operation-id': operationId,
          'index': index,
          'status': 0,
          'comment': comment
        })
      });

      const data = await response.json();
      
      if (data.type === 'successful') {
        setCommentInputs({...commentInputs, [`${operationId}-${index}`]: ''});
      }
      
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const getSimilarityColor = (score) => {
    if (score >= 90) return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
    if (score >= 80) return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    if (score >= 70) return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
    return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
  };

  const getSimilarityTextColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-slate-400';
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-l from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  سیستم تشخیص تشابه پیشنهادات
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">شرکت فولاد مبارکه اصفهان</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Settings className={`w-5 h-5 text-slate-300 transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Search Mode Toggle */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-3 p-1.5 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-xl w-fit mx-auto">
            <button
              onClick={() => setSearchMode('text')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                searchMode === 'text' 
                  ? 'bg-gradient-to-l from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              جستجو با متن
            </button>
            <button
              onClick={() => setSearchMode('id')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                searchMode === 'id' 
                  ? 'bg-gradient-to-l from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hash className="w-4 h-4" />
              جستجو با کد
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-l from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {searchMode === 'text' ? 'جستجوی پیشنهادات مشابه' : 'جستجو با کد پیشنهاد'}
            </h2>
            <p className="text-slate-400 text-lg">
              {searchMode === 'text' 
                ? 'عنوان و شرح پیشنهاد خود را وارد کنید'
                : 'کد پیشنهاد را وارد کنید'}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-l from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5">
                {searchMode === 'text' ? (
                  <div className="space-y-3 p-4">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="عنوان پیشنهاد..."
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) handleSearch();
                      }}
                      placeholder="شرح پیشنهاد..."
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
                      rows="4"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={suggestionCode}
                    onChange={(e) => setSuggestionCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="کد پیشنهاد را وارد کنید (مثال: CSS-1398-R&D-025603)"
                    className="w-full bg-transparent border-0 px-6 py-4 text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
                  />
                )}
                
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="text-sm text-slate-500">
                    {searchMode === 'text' ? 'Ctrl + Enter برای جستجو' : 'Enter برای جستجو'}
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-6 py-2.5 bg-gradient-to-l from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال پردازش...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>جستجو</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">خطا</h3>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">در حال تحلیل تشابه...</h3>
              <p className="text-slate-400">سیستم هوش مصنوعی در حال مقایسه با پیشنهادات ثبت شده است</p>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-12 max-w-6xl mx-auto">
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-200">تنظیمات جستجو</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">کد کمیته</label>
                  <input
                    type="text"
                    value={settings.committeeCode}
                    onChange={(e) => setSettings({...settings, committeeCode: e.target.value})}
                    placeholder="مثال: COM001"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">وضعیت</label>
                  <input
                    type="text"
                    value={settings.status}
                    onChange={(e) => setSettings({...settings, status: e.target.value})}
                    placeholder="مثال: approved"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">تکراری</label>
                  <select
                    value={settings.isDuplicated === null ? '' : settings.isDuplicated}
                    onChange={(e) => setSettings({...settings, isDuplicated: e.target.value === '' ? null : e.target.value === 'true'})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="">همه</option>
                    <option value="true">بله</option>
                    <option value="false">خیر</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">تاریخ شروع</label>
                  <input
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({...settings, startDate: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">تاریخ پایان</label>
                  <input
                    type="date"
                    value={settings.endDate}
                    onChange={(e) => setSettings({...settings, endDate: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-slate-400">حداقل تشابه</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.threshold}
                      onChange={(e) => setSettings({...settings, threshold: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-purple-400 font-semibold w-12 text-center">{toPersianNum(Math.round(settings.threshold * 100))}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-slate-400">تعداد نتایج</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={settings.topK}
                      onChange={(e) => setSettings({...settings, topK: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-indigo-400 font-semibold w-12 text-center">{toPersianNum(settings.topK)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-slate-400">وزن جستجوی معنایی (Alpha)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.alpha}
                      onChange={(e) => setSettings({...settings, alpha: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-blue-400 font-semibold w-12 text-center">{toPersianNum(Math.round(settings.alpha * 100))}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isSearching && results && results.results && results.results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-semibold text-slate-200">
                  پیشنهادات مشابه ({toPersianNum(results.results.length)})
                </h3>
              </div>
              
              {/* Statistics */}
              <div className="flex gap-4 text-sm">
                <div className="text-slate-400">
                  کمینه: <span className="text-indigo-400 font-semibold">{toPersianNum(Math.round(results['more-info'].min))}%</span>
                </div>
                <div className="text-slate-400">
                  میانه: <span className="text-blue-400 font-semibold">{toPersianNum(Math.round(results['more-info'].mid))}%</span>
                </div>
                <div className="text-slate-400">
                  میانگین: <span className="text-purple-400 font-semibold">{toPersianNum(Math.round(results['more-info'].med))}%</span>
                </div>
                <div className="text-slate-400">
                  بیشینه: <span className="text-emerald-400 font-semibold">{toPersianNum(Math.round(results['more-info'].max))}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {results.results.map((result) => (
                <div
                  key={result.id}
                  className="group relative"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-l ${getSimilarityColor(result.similarity_percent).split(' ')[0]} ${getSimilarityColor(result.similarity_percent).split(' ')[1]} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${getSimilarityColor(result.similarity_percent).split(' ')[2]} rounded-2xl p-6 hover:bg-slate-900/60 transition-all duration-300`}>
                    {/* Similarity Score Header */}
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <div className="flex-1">
                        <button
                          onClick={() => setExpandedResults({...expandedResults, [result.id]: !expandedResults[result.id]})}
                          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-2"
                        >
                          {expandedResults[result.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span className="text-sm font-medium">جزئیات کامل</span>
                        </button>
                        
                        <h4 className="text-lg font-semibold text-slate-100 mb-2">{result.title}</h4>
                        <p className="text-slate-300 leading-relaxed">{result.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className={`text-3xl font-bold ${getSimilarityTextColor(result.similarity_percent)}`}>
                          {toPersianNum(result.similarity_percent)}%
                        </div>
                        <div className="text-xs text-slate-500">تشابه</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedResults[result.id] && (
                      <div className="mb-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-slate-800/30 rounded-lg px-3 py-2">
                          <div className="text-xs text-slate-500 mb-1">کد پیشنهاد</div>
                          <div className="text-sm text-slate-200">{result.code}</div>
                        </div>
                        {result.status && (
                          <div className="bg-slate-800/30 rounded-lg px-3 py-2">
                            <div className="text-xs text-slate-500 mb-1">وضعیت</div>
                            <div className="text-sm text-slate-200">{result.status}</div>
                          </div>
                        )}
                        {result.committee_name && (
                          <div className="bg-slate-800/30 rounded-lg px-3 py-2">
                            <div className="text-xs text-slate-500 mb-1">کمیته</div>
                            <div className="text-sm text-slate-200">{result.committee_name}</div>
                          </div>
                        )}
                        {result.seed && (
                          <div className="bg-slate-800/30 rounded-lg px-3 py-2">
                            <div className="text-xs text-slate-500 mb-1">منبع</div>
                            <div className="text-sm text-slate-200">{result.seed}</div>
                          </div>
                        )}
                        {result.rejection_reason && (
                          <div className="bg-slate-800/30 rounded-lg px-3 py-2 col-span-2">
                            <div className="text-xs text-slate-500 mb-1">دلیل رد</div>
                            <div className="text-sm text-slate-200">{result.rejection_reason}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Feedback & Comments */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      {/* Feedback Buttons */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">آیا این نتیجه مفید بود؟</span>
                        <button
                          onClick={() => handleFeedback(results['operation-id'], result.index, 'positive')}
                          disabled={feedbackGiven[`${results['operation-id']}-${result.index}`] === 'positive'}
                          className={`p-2 rounded-lg border transition-all duration-300 ${
                            feedbackGiven[`${results['operation-id']}-${result.index}`] === 'positive'
                              ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-300'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(results['operation-id'], result.index, 'negative')}
                          disabled={feedbackGiven[`${results['operation-id']}-${result.index}`] === 'negative'}
                          className={`p-2 rounded-lg border transition-all duration-300 ${
                            feedbackGiven[`${results['operation-id']}-${result.index}`] === 'negative'
                              ? 'bg-rose-500/30 border-rose-500/50 text-rose-300'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 hover:border-rose-500/50 text-rose-400'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comment Section */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[`${results['operation-id']}-${result.index}`] || ''}
                          onChange={(e) => setCommentInputs({...commentInputs, [`${results['operation-id']}-${result.index}`]: e.target.value})}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(results['operation-id'], result.index);
                          }}
                          placeholder="نظر یا توضیحات خود را بنویسید..."
                          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                        <button
                          onClick={() => handleCommentSubmit(results['operation-id'], result.index)}
                          disabled={!commentInputs[`${results['operation-id']}-${result.index}`]?.trim()}
                          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 disabled:bg-slate-700/30 border border-indigo-500/30 disabled:border-slate-600/30 rounded-lg text-indigo-400 disabled:text-slate-600 transition-all duration-300 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isSearching && results && results.results && results.results.length === 0 && (
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">نتیجه‌ای یافت نشد</h3>
            <p className="text-slate-500">پیشنهاد مشابهی با این معیارها وجود ندارد</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SimilarityChecker;