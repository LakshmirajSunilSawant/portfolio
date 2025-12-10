// Utility functions for localStorage management

export const STORAGE_KEY = 'portfolio_resume_data';

export const saveResumeData = (data: any) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving resume data:', error);
        return false;
    }
};

export const loadResumeData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading resume data:', error);
        return null;
    }
};

export const clearResumeData = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing resume data:', error);
        return false;
    }
};
