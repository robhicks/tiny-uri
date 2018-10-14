export const atob = typeof window !== 'undefined' ? window.atob : (data) => Buffer.from(data, 'base64').toString('ascii');
export const btoa = typeof window !== 'undefined' ? window.btoa : (data) => Buffer.from(data, 'ascii').toString('base64');
