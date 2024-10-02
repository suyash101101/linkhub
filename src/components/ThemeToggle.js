import React from 'react';

const ThemeToggle = ({ theme, onThemeChange }) => {
  const themes = ['light', 'dark', 'blue', 'green'];

  return (
    <div className="p-4 flex space-x-4 fixed top-0 right-0">
      <select
        value={theme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="p-2 rounded border dark:border-gray-700"
      >
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} Theme
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeToggle;
