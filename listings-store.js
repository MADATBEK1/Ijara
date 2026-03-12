// ================================================================
//  IjaraGo — E'LONLAR OMBORI (listings store)
//  Foydalanuvchi e'lonlari qo'shish/o'qish/tasdiqlash tizimi
// ================================================================

const STORE = {
    KEY: 'ij_user_listings',

    getAll() {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    },

    save(listings) {
        localStorage.setItem(this.KEY, JSON.stringify(listings));
    },

    // Yangi e'lon qo'shish (pending holda)
    add(listingData, user) {
        const listings = this.getAll();
        const id = 'ul_' + Date.now();
        const newListing = {
            id,
            // Asosiy ma'lumotlar
            title: listingData.title,
            category: listingData.category,
            categoryLabel: listingData.categoryLabel,
            price: parseInt(listingData.price),
            priceType: listingData.priceType,
            location: listingData.location,
            description: listingData.description,
            features: listingData.features || [],
            image: listingData.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
            minDays: parseInt(listingData.minDays) || 1,
            deposit: parseInt(listingData.deposit) || 0,
            phone: listingData.phone,

            // Egador ma'lumotlari
            owner: user.firstName + ' ' + user.lastName,
            ownerId: user.id,
            ownerImg: user.avatar,
            ownerEmail: user.email,

            // Statistikalar (boshida nol)
            rating: 0,
            reviews: 0,
            verified: false,
            premium: false,
            available: true,

            // Holat
            status: 'pending', // 'pending' | 'approved' | 'rejected' | 'blocked'
            createdAt: new Date().toISOString(),
            approvedAt: null,
            rejectedReason: null,
        };
        listings.unshift(newListing);
        this.save(listings);
        return newListing;
    },

    // Tasdiqlash (admin)
    approve(id) {
        const listings = this.getAll();
        const idx = listings.findIndex(l => l.id === id);
        if (idx === -1) return false;
        listings[idx].status = 'approved';
        listings[idx].approvedAt = new Date().toISOString();
        listings[idx].verified = true;
        listings[idx].rating = 4.5;
        listings[idx].reviews = 0;
        this.save(listings);
        return true;
    },

    // Rad etish (admin)
    reject(id, reason) {
        const listings = this.getAll();
        const idx = listings.findIndex(l => l.id === id);
        if (idx === -1) return false;
        listings[idx].status = 'rejected';
        listings[idx].rejectedReason = reason || 'Talabga javob bermaydi';
        this.save(listings);
        return true;
    },

    // Bloklash (admin)
    block(id) {
        const listings = this.getAll();
        const idx = listings.findIndex(l => l.id === id);
        if (idx === -1) return false;
        listings[idx].status = 'blocked';
        this.save(listings);
        return true;
    },

    // O'chirish
    delete(id) {
        const listings = this.getAll();
        this.save(listings.filter(l => l.id !== id));
        return true;
    },

    // Faqat tasdiqlangan e'lonlarni olish
    getApproved() {
        return this.getAll().filter(l => l.status === 'approved');
    },

    // Faqat kutilayotganlarni olish
    getPending() {
        return this.getAll().filter(l => l.status === 'pending');
    },

    // Foydalanuvchining e'lonlari
    getByUser(userId) {
        return this.getAll().filter(l => l.ownerId === userId);
    },

    // Barcha e'lonlar (LISTINGS + user listings approved)
    getAllMerged() {
        const userListings = this.getApproved();
        // Static LISTINGS + user approved listings ni birlashtirish
        const allItems = [...(typeof LISTINGS !== 'undefined' ? LISTINGS : [])];
        userListings.forEach(ul => {
            // Convert to LISTINGS format
            allItems.unshift({
                id: ul.id,
                title: ul.title,
                category: ul.category,
                categoryLabel: ul.categoryLabel,
                price: ul.price,
                priceType: ul.priceType,
                location: ul.location,
                description: ul.description,
                features: ul.features,
                image: ul.image,
                minDays: ul.minDays,
                deposit: ul.deposit,
                owner: ul.owner,
                ownerImg: ul.ownerImg,
                rating: ul.rating || 4.5,
                reviews: ul.reviews || 0,
                verified: ul.verified,
                premium: ul.premium,
                available: ul.available,
                isUserListing: true
            });
        });
        return allItems;
    }
};
