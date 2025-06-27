const supabase = require('../supabase');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const ALLOWED_BUCKETS = [
    "profile_pictures",
    "test_pictures",
    "templates",
    "question_images",
    "question_videos",
    "answer_explanation",
    "uploads"
];

exports.uploadMiddleware = upload.single('file');

// exports.uploadFile = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'Nenhum arquivo enviado' });
//         }

//         const { bucket } = req.body;
//         if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
//             return res.status(400).json({ error: 'Bucket inválido ou não permitido' });
//         }

//         const fileBuffer = req.file.buffer;
//         const filePath = `${Date.now()}-${req.file.originalname}`;

//         const { data, error } = await supabase.storage
//             .from(bucket)
//             .upload(filePath, fileBuffer, {
//                 cacheControl: '3600',
//                 upsert: false,
//                 contentType: req.file.mimetype
//             });

//         if (error) {
//             return res.status(500).json({ error: error.message });
//         }

//         const publicUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;

//         res.status(200).json({ 
//             message: 'Upload realizado com sucesso', 
//             url: publicUrl,
//             fileName: filePath,
//             bucket
//         });
//     } catch (err) {
//         console.error('Erro ao fazer upload:', err);
//         res.status(500).json({ error: 'Erro interno no servidor' });
//     }
// };


exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const { bucket } = req.body;
        
        if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
            return res.status(400).json({ error: 'Bucket inválido ou não permitido' });
        }

        const fileBuffer = req.file.buffer;
        const filePath = `${Date.now()}-${req.file.originalname}`;

        const { data, error } = await supabase.storage
            .from(bucket) 
            .upload(filePath, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: req.file.mimetype
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const publicUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;

        res.status(200).json({ 
            message: 'Upload realizado com sucesso', 
            url: publicUrl,
            fileName: filePath,
            bucket
        });
    } catch (err) {
        console.error('Erro ao fazer upload:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};


exports.getFile = async (req, res) => {
    try {
        const { bucket, fileName } = req.params;

        const ALLOWED_BUCKETS = [
            "profile_pictures", 
            "test_pictures", 
            "templates", 
            "question_images", 
            "question_videos", 
            "answer_explanation", 
            "uploads"
        ];

        if (!ALLOWED_BUCKETS.includes(bucket)) {
            return res.status(400).json({ error: 'Bucket inválido ou não permitido' });
        }

        const { data, error } = await supabase.storage
            .from(bucket) 
            .download(fileName); 

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.setHeader('Content-Type', data.type);

        res.status(200).send(data);
    } catch (err) {
        console.error('Erro ao baixar o arquivo:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};