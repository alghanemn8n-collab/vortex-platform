import { useState } from 'react';
import { generateImageURL, AVAILABLE_MODELS } from '../utils/imageGenerator';
import './ImageGenerator.css';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS.SD_2_1);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('الرجاء إدخال وصف للصورة');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageUrl = await generateImageURL(prompt, apiKey || null);
            setGeneratedImage(imageUrl);
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء توليد الصورة');
        } finally {
            setIsLoading(false);
        }
    };

    const quickPrompts = [
        'futuristic AI robot with glowing cyan and purple lights',
        'abstract tech background with particle effects',
        'modern minimalist logo for tech company',
        'cyberpunk city at night with neon lights',
        'holographic interface with data streams',
    ];

    return (
        <div className="image-generator-container">
            <div className="container">
                <h1 className="text-gradient">مولد الصور بالذكاء الاصطناعي</h1>
                <p className="subtitle">استخدام Stable Diffusion عبر Hugging Face</p>

                <div className="generator-content">
                    {/* Input Section */}
                    <div className="input-section glass-panel">
                        <div className="form-group">
                            <label htmlFor="prompt">وصف الصورة (بالإنجليزية)</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="مثال: a beautiful sunset over mountains with vibrant colors"
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apiKey">
                                Hugging Face API Token (اختياري)
                                <span className="hint">للحصول على نتائج أفضل وأسرع</span>
                            </label>
                            <input
                                type="password"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="hf_xxxxxxxxxxxxx"
                            />
                            <a
                                href="https://huggingface.co/settings/tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="api-link"
                            >
                                احصل على API Token مجاني →
                            </a>
                        </div>

                        <div className="form-group">
                            <label htmlFor="model">اختر النموذج</label>
                            <select
                                id="model"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                <option value={AVAILABLE_MODELS.SD_2_1}>Stable Diffusion 2.1</option>
                                <option value={AVAILABLE_MODELS.DREAMSHAPER}>DreamShaper</option>
                                <option value={AVAILABLE_MODELS.OPENJOURNEY}>OpenJourney</option>
                                <option value={AVAILABLE_MODELS.SD_1_5}>Stable Diffusion 1.5</option>
                            </select>
                        </div>

                        <button
                            className="btn-primary btn-large"
                            onClick={handleGenerate}
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري التوليد...' : 'توليد الصورة'}
                        </button>

                        {/* Quick Prompts */}
                        <div className="quick-prompts">
                            <p>أمثلة سريعة:</p>
                            <div className="prompts-grid">
                                {quickPrompts.map((p, index) => (
                                    <button
                                        key={index}
                                        className="quick-prompt-btn"
                                        onClick={() => setPrompt(p)}
                                    >
                                        {p.substring(0, 30)}...
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="output-section">
                        {isLoading && (
                            <div className="loading-state glass-panel">
                                <div className="spinner"></div>
                                <p>جاري توليد الصورة...</p>
                                <p className="loading-hint">قد يستغرق هذا 10-30 ثانية</p>
                            </div>
                        )}

                        {error && (
                            <div className="error-state glass-panel">
                                <p className="error-icon">⚠️</p>
                                <p className="error-message">{error}</p>
                                <p className="error-hint">
                                    نصيحة: استخدم API Token للحصول على نتائج أفضل
                                </p>
                            </div>
                        )}

                        {generatedImage && !isLoading && (
                            <div className="image-result glass-panel">
                                <img src={generatedImage} alt="Generated" className="generated-image" />
                                <div className="image-actions">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = generatedImage;
                                            a.download = 'vortex-generated-image.png';
                                            a.click();
                                        }}
                                    >
                                        تحميل الصورة
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setGeneratedImage(null)}
                                    >
                                        توليد صورة جديدة
                                    </button>
                                </div>
                            </div>
                        )}

                        {!generatedImage && !isLoading && !error && (
                            <div className="placeholder-state glass-panel">
                                <p className="placeholder-icon">🎨</p>
                                <p>الصورة المولدة ستظهر هنا</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="info-section">
                    <div className="info-card glass-panel">
                        <h3>📌 ملاحظات هامة</h3>
                        <ul>
                            <li>استخدم وصفاً دقيقاً بالإنجليزية للحصول على أفضل النتائج</li>
                            <li>بدون API Token: محدود بـ 1000 طلب شهرياً</li>
                            <li>مع API Token مجاني: 30,000 طلب شهرياً</li>
                            <li>وقت التوليد: 10-30 ثانية حسب حمل الخادم</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
