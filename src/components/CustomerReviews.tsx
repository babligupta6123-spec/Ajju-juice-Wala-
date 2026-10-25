import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Review } from '../types';
import { SHOP_CONFIG } from '../shopConfig';

const REVIEWS_STORAGE_KEY = 'ajju_juice_customer_reviews';

export const CustomerReviews: React.FC = () => {
  // Load real user reviews from localStorage
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [showAddReview, setShowAddReview] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newDrink, setNewDrink] = useState('Fresh Orange Juice');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsList));
    } catch {
      // Ignore storage errors
    }
  }, [reviewsList]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newEntry: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Today',
      drinkOrdered: newDrink,
      comment: newComment.trim(),
      avatarBg: 'bg-emerald-100 text-emerald-800',
    };

    setReviewsList([newEntry, ...reviewsList]);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setShowAddReview(false);
      setSubmittedFeedback(false);
      setNewAuthor('');
      setNewComment('');
    }, 1500);
  };

  const averageRating =
    reviewsList.length > 0
      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
      : null;

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0A2616] tracking-tight font-heading">
              Customer Reviews
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Authentic opinions from people who visit {SHOP_CONFIG.brandName}. We do not publish fabricated or artificial ratings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {averageRating && (
              <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-2xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-extrabold text-stone-900">{averageRating} / 5.0</span>
                <span className="text-xs text-stone-500">({reviewsList.length} reviews)</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddReview(true)}
              className="inline-flex items-center gap-2 bg-[#FF5E0E] hover:bg-[#E24D00] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer whitespace-nowrap"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Real Reviews Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start sm:items-center gap-3 text-xs text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong>Genuine Feedback Policy:</strong> In line with truth-in-advertising guidelines, {SHOP_CONFIG.brandName} does not invent dummy testimonials. Customer reviews submitted here appear directly below.
          </p>
        </div>

        {/* Reviews Grid or Empty State */}
        {reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsList.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center text-amber-400 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${review.avatarBg}`}
                  >
                    {review.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {review.author}
                    </p>
                    <p className="text-[11px] text-orange-600 font-medium truncate">
                      Ordered {review.drinkOrdered}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl mb-4">
              ✨
            </div>
            <h3 className="text-lg font-black text-stone-900 font-heading mb-1.5">
              Be the First to Review {SHOP_CONFIG.brandName}!
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Visited our juice stall or tried our fresh delivery? We would love to hear what you thought of your drink.
            </p>
            <button
              type="button"
              onClick={() => setShowAddReview(true)}
              className="inline-flex items-center gap-2 bg-[#0A2616] hover:bg-[#123822] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Write Your Review Now</span>
            </button>
          </div>
        )}

        {/* Add Review Dialog */}
        {showAddReview && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddReview(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200">
              <h3 id="review-dialog-title" className="text-lg font-black text-stone-900 mb-1 font-heading">
                Share Your Experience with {SHOP_CONFIG.brandName}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Your feedback helps us keep our fruit drinks fresh and delicious.
              </p>

              {submittedFeedback ? (
                <div className="py-8 text-center text-emerald-600 flex flex-col items-center gap-2">
                  <CheckCircle className="w-10 h-10" />
                  <p className="font-bold text-sm">Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3.5">
                  <div>
                    <label htmlFor="reviewer-name" className="text-xs font-bold text-stone-800 block mb-1">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reviewer-name"
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="reviewer-drink" className="text-xs font-bold text-stone-800 block mb-1">
                      Drink You Ordered
                    </label>
                    <select
                      id="reviewer-drink"
                      value={newDrink}
                      onChange={(e) => setNewDrink(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Fresh Orange Juice">Fresh Orange Juice</option>
                      <option value="Alphonso Mango Juice">Alphonso Mango Juice</option>
                      <option value="Watermelon Cooler">Watermelon Cooler</option>
                      <option value="Pineapple Juice">Pineapple Juice</option>
                      <option value="Mixed Fruit Juice">Mixed Fruit Juice</option>
                      <option value="Strawberry Smoothie">Strawberry Smoothie</option>
                      <option value="Banana Milkshake">Banana Milkshake</option>
                      <option value="Chocolate Milkshake">Chocolate Milkshake</option>
                      <option value="Green Apple Cooler">Green Apple Cooler</option>
                      <option value="Fresh Lemon Mint">Fresh Lemon Mint</option>
                      <option value="Special Value Combo">Special Value Combo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                            newRating >= star
                              ? 'text-amber-500 bg-amber-50 border-amber-300'
                              : 'text-stone-300 border-stone-200'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reviewer-comment" className="text-xs font-bold text-stone-800 block mb-1">
                      Your Comments <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="reviewer-comment"
                      rows={3}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="How was the freshness, taste, and packaging?"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReview(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#FF5E0E] hover:bg-[#E24D00] text-white text-xs font-bold shadow-md"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
