import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, currentTheme, themes, changeTheme, isAnimating } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    {
      key: 'default',
      name: 'Default',
      description: 'Clean and professional',
      preview: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#F9FAFB'
      }
    },
    {
      key: 'ocean',
      name: 'Ocean Breeze',
      description: 'Refreshing teal tones',
      preview: {
        primary: '#0F766E',
        secondary: '#64748B',
        background: '#F0FDFA'
      }
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm text-gray-900"
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium">Themes</span>
        <Sparkles className="h-4 w-4 text-yellow-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 card rounded-xl shadow-xl z-50 overflow-hidden max-w-[calc(100vw-2rem)] sm:right-0 left-auto">
          <div className="p-4 border-b border-gray-200 theme-dark:border-slate-600">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center theme-dark:text-white">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              Choose Theme
            </h3>
            <p className="text-sm text-gray-600 mt-1 theme-dark:text-slate-300">Select a theme that suits your style</p>
          </div>

          <div className="p-2 max-h-96 overflow-y-auto">
            {themeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  changeTheme(option.key);
                  setIsOpen(false);
                }}
                disabled={isAnimating}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  currentTheme === option.key
                    ? 'ring-2 ring-blue-500 bg-blue-50 theme-dark:ring-2 theme-dark:ring-cyan-400 theme-dark:bg-slate-700'
                    : 'hover:bg-gray-50 theme-dark:hover:bg-slate-600'
                } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: option.preview.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: option.preview.secondary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: option.preview.background }}
                      ></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 theme-dark:text-white">{option.name}</div>
                      <div className="text-sm text-gray-600 theme-dark:text-slate-300">{option.description}</div>
                    </div>
                  </div>
                  {currentTheme === option.key && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 theme-dark:border-slate-600 theme-dark:bg-slate-700">
            <div className="text-xs text-gray-500 text-center theme-dark:text-slate-400">
              Theme changes apply instantly
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
