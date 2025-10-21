import React from 'react';

export default function GuestBook() {
  return (
    <section className="flex justify-center items-center mt-8 pt-12 pb-20 bg-white">
      <div className="w-full max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Guest Book</h2>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-medium text-gray-700 mb-6">Sign Our Guestbook</h3>

          <form
            className="space-y-5"
            id="new_comment"
            noValidate
            action="/cards/faizaladriana/comments"
            acceptCharset="UTF-8"
            method="post"
          >
            <input name="utf8" type="hidden" value="✓" />
            <input
              type="hidden"
              name="authenticity_token"
              value="3S6AwXFKdE+d31veBC1L+lj+QUaES0x2r1h9vS8xH7AkwJ+ws+FJYPjCMrv4++OmmlYQRrZgnM3+rD7/wNQbPA=="
            />

            {/* Name Field */}
            <div className="text-left">
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="comment_name"
              >
                Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                placeholder="Asyraf Zahari"
                type="text"
                name="comment[name]"
                id="comment_name"
              />
            </div>

            {/* Message Field */}
            <div className="text-left">
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="comment_body"
              >
                Message
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition h-28 resize-none"
                placeholder="Congratulations! Wishing you a lifetime of love and happiness."
                name="comment[body]"
                id="comment_body"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                name="commit"
                disabled
                className="w-full bg-pink-500 text-white font-medium py-2.5 rounded-md shadow-sm hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                data-disable-with="Leave A Wish"
              >
                Leave A Wish
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
