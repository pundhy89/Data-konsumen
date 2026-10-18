// Robust IndexedDB storage for large images without localStorage 5MB quota limitations
const DB_NAME = 'sikpr_storage_db';
const STORE_NAME = 'siteplan_assets';
const KEY = 'custom_siteplan_image';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSiteplanImageToDB(file: File | Blob): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to save image to IndexedDB:', error);
  }
}

export async function loadSiteplanImageFromDB(): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY);

      request.onsuccess = () => {
        const result = request.result;
        if (result instanceof Blob) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.warn('Failed to get image from IndexedDB:', request.error);
        resolve(null);
      };
    });
  } catch (error) {
    console.warn('IndexedDB not accessible:', error);
    return null;
  }
}

export async function clearSiteplanImageFromDB(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to clear image from IndexedDB:', error);
  }
}

const HOUSEPLAN_KEY = 'custom_houseplan_type36_66_image';

export async function saveHouseplanImageToDB(file: File | Blob): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, HOUSEPLAN_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to save houseplan image to IndexedDB:', error);
  }
}

export async function loadHouseplanImageFromDB(): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(HOUSEPLAN_KEY);

      request.onsuccess = () => {
        const result = request.result;
        if (result instanceof Blob) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.warn('Failed to get houseplan image from IndexedDB:', request.error);
        resolve(null);
      };
    });
  } catch (error) {
    console.warn('IndexedDB not accessible:', error);
    return null;
  }
}

export async function clearHouseplanImageFromDB(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(HOUSEPLAN_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to clear houseplan image from IndexedDB:', error);
  }
}

