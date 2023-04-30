import { XMarkIcon } from '@heroicons/react/20/solid';

export default async function NewStoryPage() {

  return (
    <div className="grid gap-4 place-content-center h-screen w-full	">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
            Theme
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="theme"
            type="text"
            placeholder="Adventure, Romance, Sci-fi, ..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
            Language
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="language"
          >
            <option value="italian">Italian</option>
            <option value="portuguese">Portuguese</option>
            <option value="english">English</option>
            <option value="french">French</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="narrative-style">
            Narrative Style
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="narrative-style"
            type="text"
            placeholder="First Person, Third Person, Epistolary, ..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grammar-options">
            Grammar Options
          </label>
          <select
            multiple
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="grammar-options"
          >
            <option value="past">Past Tense</option>
            <option value="present">Present Tense</option>
            <option value="future">Future Tense</option>
            <option value="past-continuous">Past Continuous</option>
            <option value="present-continuous">Present Continuous</option>
            <option value="future-continuous">Future Continuous</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specific-words">
            Specific Words
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="specific-words"
            type="text"
            placeholder="First Person, Third Person, Epistolary, ..."
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Story
          </button>
        </div>
      </div>
    </div>
  );
};
