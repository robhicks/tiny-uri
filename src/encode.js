export const base64Decode = typeof window !== 'undefined' ? window.atob : (data) => Buffer.from(data, 'base64').toString('ascii');
export const base65Encode = typeof window !== 'undefined' ? window.btoa : (data) => Buffer.from(data, 'ascii').toString('base64');
