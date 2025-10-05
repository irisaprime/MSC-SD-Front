import React, { useState } from 'react';
import { Search, Settings, Loader2, TrendingUp, Clock, Sparkles, Filter, Hash, ThumbsUp, ThumbsDown, MessageSquare, Send, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const SimilarityChecker = () => {
  const [searchMode, setSearchMode] = useState('text'); // 'text' or 'id'
  const [query, setQuery] = useState('');
  const [suggestionId, setSuggestionId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState([]);
  const [expandedResults, setExpandedResults] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  
  const [settings, setSettings] = useState({
    maxResults: 5,
    threshold: 0.7,
    semanticWeight: 0.6
  });

  // Field visibility settings
  const [visibleFields, setVisibleFields] = useState({
    id: true,
    code: true,
    employee_number: true,
    jalali_date: true,
    gregorian_date: false,
    hour: false,
    minute: false,
    second: false,
    title: true,
    description: true,
    status: true,
    type_code: false,
    type: true,
    feasibility_code: false,
    feasibility: true,
    committee_code: false,
    supervisor_employee_number: false,
    supervisor_name: true
  });

  const fieldLabels = {
    id: 'شناسه پیشنهاد',
    code: 'کد پیشنهاد',
    employee_number: 'شماره پرسنلی ثبت‌کننده',
    jalali_date: 'تاریخ ثبت (شمسی)',
    gregorian_date: 'تاریخ ثبت (میلادی)',
    hour: 'ساعت',
    minute: 'دقیقه',
    second: 'ثانیه',
    title: 'عنوان پیشنهاد',
    description: 'شرح پیشنهاد',
    status: 'وضعیت',
    type_code: 'کد نوع پیشنهاد',
    type: 'نوع پیشنهاد',
    feasibility_code: 'کد امکان اجرا',
    feasibility: 'امکان اجرا',
    committee_code: 'کد کمیته',
    supervisor_employee_number: 'شماره پرسنلی مسئول',
    supervisor_name: 'نام مسئول'
  };

  // Convert to Persian numbers
  const toPersianNum = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  // Mock search function - replace with actual API call
  const handleSearch = async () => {
    const searchValue = searchMode === 'id' ? suggestionId : query;
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call - REPLACE WITH YOUR ACTUAL API
    setTimeout(() => {
      const mockResults = [
        {
          id: 12345,
          code: 'SUG-2024-001',
          employee_number: '98765',
          jalali_date: '1403/06/15',
          gregorian_date: '2024-09-06',
          hour: 14,
          minute: 30,
          second: 45,
          title: 'بهبود سیستم تهویه مطبوع',
          description: 'پیشنهاد بهبود سیستم تهویه مطبوع سالن تولید برای افزایش راندمان و کاهش مصرف انرژی',
          status: 'در حال بررسی',
          type_code: 'T01',
          type: 'بهبود فرآیند',
          feasibility_code: 'F01',
          feasibility: 'قابل اجرا',
          committee_code: 'C05',
          supervisor_employee_number: '11223',
          supervisor_name: 'محمد رضایی',
          similarity: 0.92
        },
        {
          id: 12340,
          code: 'SUG-2024-002',
          title: 'ارتقای کیفیت هوا',
          description: 'ارتقای کیفیت هوای سالن با نصب دستگاه‌های تصفیه هوا',
          jalali_date: '1403/05/22',
          status: 'تایید شده',
          type: 'بهبود محیط کار',
          feasibility: 'قابل اجرا',
          supervisor_name: 'سارا احمدی',
          similarity: 0.87
        }
      ].filter(r => r.similarity >= settings.threshold).slice(0, settings.maxResults);
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  // Feedback API call
  const handleFeedback = async (resultId, feedbackType) => {
    // REPLACE WITH YOUR ACTUAL API ENDPOINT
    console.log('Sending feedback:', { resultId, feedbackType });
    
    // Mock API call
    /*
    await fetch('YOUR_FEEDBACK_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId, feedbackType })
    });
    */
  };

  // Comment API call
  const handleCommentSubmit = async (resultId) => {
    const comment = commentInputs[resultId];
    if (!comment?.trim()) return;
    
    // REPLACE WITH YOUR ACTUAL API ENDPOINT
    console.log('Sending comment:', { resultId, comment });
    
    // Mock API call
    /*
    await fetch('YOUR_COMMENT_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId, comment })
    });
    */
    
    setComments({...comments, [resultId]: comment});
    setCommentInputs({...commentInputs, [resultId]: ''});
  };

  const getSimilarityColor = (score) => {
    if (score >= 0.9) return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
    if (score >= 0.8) return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    if (score >= 0.7) return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
    return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
  };

  const getSimilarityTextColor = (score) => {
    if (score >= 0.9) return 'text-emerald-400';
    if (score >= 0.8) return 'text-blue-400';
    if (score >= 0.7) return 'text-amber-400';
    return 'text-slate-400';
  };

  const toggleFieldVisibility = (field) => {
    setVisibleFields({...visibleFields, [field]: !visibleFields[field]});
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-vazir overflow-hidden">
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
              جستجو با شناسه
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-l from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {searchMode === 'text' ? 'جستجوی پیشنهادات مشابه' : 'جستجو با شناسه پیشنهاد'}
            </h2>
            <p className="text-slate-400 text-lg">
              {searchMode === 'text' 
                ? 'پیشنهاد خود را وارد کنید تا موارد مشابه قبلی را بررسی کنیم'
                : 'شناسه پیشنهاد را وارد کنید (برای تست سریع)'}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-l from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5">
                {searchMode === 'text' ? (
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) handleSearch();
                    }}
                    placeholder="پیشنهاد خود را اینجا بنویسید..."
                    className="custom-scrollbar w-full bg-transparent border-0 px-6 py-4 text-slate-100 placeholder-slate-500 resize-none focus:outline-none text-lg"
                    rows="4"
                  />
                ) : (
                  <input
                    type="text"
                    value={suggestionId}
                    onChange={(e) => setSuggestionId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="شناسه پیشنهاد را وارد کنید (مثال: 12345)"
                    className="w-full bg-transparent border-0 px-6 py-4 text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
                  />
                )}
                
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="text-sm text-slate-500">
                    {searchMode === 'text' ? 'Ctrl + Enter برای جستجو' : 'Enter برای جستجو'}
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || (searchMode === 'text' ? !query.trim() : !suggestionId.trim())}
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
          <div className="mb-12 max-w-6xl mx-auto animate-fadeIn">
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-200">تنظیمات سیستم</h3>
              </div>
              
              {/* Search Settings */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <h4 className="text-sm font-semibold text-slate-300 mb-4">تنظیمات جستجو</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm text-slate-400">تعداد نتایج</label>
                    <div className="flex items-center gap-3" dir="ltr">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={settings.maxResults}
                        onChange={(e) => setSettings({...settings, maxResults: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="text-indigo-400 font-semibold w-8 text-center">{toPersianNum(settings.maxResults)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm text-slate-400">حداقل میزان تشابه</label>
                    <div className="flex items-center gap-3" dir="ltr">
                      <input
                        type="range"
                        min="0.5"
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
                    <label className="text-sm text-slate-400">وزن جستجوی معنایی</label>
                    <div className="flex items-center gap-3" dir="ltr">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.semanticWeight}
                        onChange={(e) => setSettings({...settings, semanticWeight: parseFloat(e.target.value)})}
                        className="flex-1 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-blue-400 font-semibold w-12 text-center">{toPersianNum(Math.round(settings.semanticWeight * 100))}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Visibility Settings */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">نمایش فیلدها در نتایج</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Object.entries(fieldLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleFieldVisibility(key)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 ${
                        visibleFields[key]
                          ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                          : 'bg-slate-800/50 border border-slate-700/50 text-slate-500'
                      }`}
                    >
                      {visibleFields[key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isSearching && results.length > 0 && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xl font-semibold text-slate-200">
                پیشنهادات مشابه یافت شده ({toPersianNum(results.length)})
              </h3>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="group relative animate-slideUp"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-l ${getSimilarityColor(result.similarity).split(' ')[0]} ${getSimilarityColor(result.similarity).split(' ')[1]} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className={`relative bg-slate-900/40 backdrop-blur-xl border ${getSimilarityColor(result.similarity).split(' ')[2]} rounded-2xl p-6 hover:bg-slate-900/60 transition-all duration-300`}>
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
                        
                        {visibleFields.title && result.title && (
                          <h4 className="text-lg font-semibold text-slate-100 mb-2">{result.title}</h4>
                        )}
                        {visibleFields.description && result.description && (
                          <p className="text-slate-300 leading-relaxed">{result.description}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className={`text-3xl font-bold ${getSimilarityTextColor(result.similarity)}`}>
                          {toPersianNum(Math.round(result.similarity * 100))}%
                        </div>
                        <div className="text-xs text-slate-500">تشابه</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedResults[result.id] && (
                      <div className="mb-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
                        {Object.entries(fieldLabels).map(([key, label]) => {
                          if (!visibleFields[key] || !result[key] || key === 'title' || key === 'description') return null;
                          return (
                            <div key={key} className="bg-slate-800/30 rounded-lg px-3 py-2">
                              <div className="text-xs text-slate-500 mb-1">{label}</div>
                              <div className="text-sm text-slate-200">{result[key]}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Comments */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      {/* Feedback Buttons */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">آیا این نتیجه مفید بود؟</span>
                        <button
                          onClick={() => handleFeedback(result.id, 'positive')}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 transition-all duration-300"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(result.id, 'negative')}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 transition-all duration-300"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comment Section */}
                      {comments[result.id] ? (
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5" />
                            <p className="text-sm text-slate-300 flex-1">{comments[result.id]}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[result.id] || ''}
                            onChange={(e) => setCommentInputs({...commentInputs, [result.id]: e.target.value})}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommentSubmit(result.id);
                            }}
                            placeholder="نظر یا توضیحات خود را بنویسید..."
                            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                          />
                          <button
                            onClick={() => handleCommentSubmit(result.id)}
                            disabled={!commentInputs[result.id]?.trim()}
                            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 disabled:bg-slate-700/30 border border-indigo-500/30 disabled:border-slate-600/30 rounded-lg text-indigo-400 disabled:text-slate-600 transition-all duration-300 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isSearching && results.length === 0 && (query || suggestionId) && (
          <div className="max-w-4xl mx-auto text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">نتیجه‌ای یافت نشد</h3>
            <p className="text-slate-500">پیشنهاد مشابهی با این معیارها وجود ندارد</p>
          </div>
        )}
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
        
        .font-vazir {
          font-family: 'Vazirmatn', sans-serif;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.7));
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out backwards;
        }

        /* LTR Sliders */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SimilarityChecker;