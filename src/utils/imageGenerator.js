/**
 * Hugging Face Image Generation Utility
 * استخدام Stable Diffusion المجاني عبر Hugging Face
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';

/**
 * توليد صورة باستخدام Hugging Face
 * @param {string} prompt - وصف الصورة المطلوبة
 * @param {string} apiKey - Hugging Face API Token (اختياري للاستخدام المجاني المحدود)
 * @returns {Promise<Blob>} - الصورة المولدة
 */
export async function generateImage(prompt, apiKey = null) {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        const envApiKey = import.meta.env.VITE_HF_TOKEN;
        const activeKey = apiKey || envApiKey;

        // إضافة API key إذا كان متوفراً
        if (activeKey) {
            headers['Authorization'] = `Bearer ${activeKey}`;
        }

        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: prompt,
                options: {
                    wait_for_model: true, // انتظار تحميل النموذج إذا لم يكن جاهزاً
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`فشل توليد الصورة: ${response.status} - ${errorText}`);
        }

        const imageBlob = await response.blob();
        return imageBlob;
    } catch (error) {
        console.error('خطأ في توليد الصورة:', error);
        throw error;
    }
}

/**
 * توليد صورة وإرجاع URL قابل للاستخدام
 * @param {string} prompt - وصف الصورة
 * @param {string} apiKey - API Token
 * @returns {Promise<string>} - URL للصورة
 */
export async function generateImageURL(prompt, apiKey = null) {
    const blob = await generateImage(prompt, apiKey);
    return URL.createObjectURL(blob);
}

/**
 * توليد صورة وحفظها كملف
 * @param {string} prompt - وصف الصورة
 * @param {string} filename - اسم الملف
 * @param {string} apiKey - API Token
 */
export async function generateAndDownloadImage(prompt, filename = 'generated-image.png', apiKey = null) {
    const blob = await generateImage(prompt, apiKey);

    // إنشاء رابط تحميل
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * نماذج Stable Diffusion المتاحة على Hugging Face
 */
export const AVAILABLE_MODELS = {
    SD_2_1: 'stabilityai/stable-diffusion-2-1',
    SD_XL: 'stabilityai/stable-diffusion-xl-base-1.0',
    SD_1_5: 'runwayml/stable-diffusion-v1-5',
    DREAMSHAPER: 'Lykon/DreamShaper',
    OPENJOURNEY: 'prompthero/openjourney',
};

/**
 * توليد صورة باستخدام نموذج محدد
 * @param {string} prompt - وصف الصورة
 * @param {string} model - اسم النموذج من AVAILABLE_MODELS
 * @param {string} apiKey - API Token
 * @returns {Promise<Blob>}
 */
export async function generateImageWithModel(prompt, model = AVAILABLE_MODELS.SD_2_1, apiKey = null) {
    const modelUrl = `https://api-inference.huggingface.co/models/${model}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const envApiKey = import.meta.env.VITE_HF_TOKEN;
    const activeKey = apiKey || envApiKey;

    if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey}`;
    }

    const response = await fetch(modelUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true }
        }),
    });

    if (!response.ok) {
        throw new Error(`فشل توليد الصورة: ${response.status}`);
    }

    return await response.blob();
}

/**
 * مثال على الاستخدام:
 * 
 * // بدون API key (محدود)
 * const imageUrl = await generateImageURL('a beautiful sunset over mountains');
 * 
 * // مع API key (أفضل)
 * const apiKey = 'hf_xxxxxxxxxxxxx';
 * const imageUrl = await generateImageURL('futuristic city with flying cars', apiKey);
 * 
 * // استخدام نموذج مختلف
 * const blob = await generateImageWithModel(
 *   'cyberpunk robot',
 *   AVAILABLE_MODELS.DREAMSHAPER,
 *   apiKey
 * );
 */
