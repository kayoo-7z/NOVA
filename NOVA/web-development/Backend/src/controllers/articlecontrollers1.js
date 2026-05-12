export const getArticles = (req, res) => {
    res.json([
        { 
            id: 1, 
            title: "Panduan Gizi NovaIQ", 
            category: "Edukasi",
        }
    ]);
};