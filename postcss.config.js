module.exports = {
    // Production
    
    purge: false,
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {},
    plugins: {
        tailwindcss: {},
        autoprefixer: {
            // overrideBrowserslist: ['last 10 versions'], 
            // grid: true
        },
    },
}