import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct } from '../../store/productSlice';

const categories = ['Whole Chicken', 'Chicken Curry Cut', 'Boneless Chicken', 'Chicken Wings', 'Chicken Liver & Gizzard'];

const emptyForm = { name: '', category: 'Whole Chicken', price: '', unit: 'kg', description: '', image: '', isAvailable: true, isSpecial: false };

export default function ManageProducts() {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        dispatch(fetchAllProductsAdmin());
    }, [dispatch]);

    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            description: product.description || '',
            image: product.image || '',
            isAvailable: product.isAvailable,
            isSpecial: product.isSpecial,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, price: Number(form.price) };
        if (editingId) {
            await dispatch(updateProduct({ id: editingId, ...data }));
        } else {
            await dispatch(createProduct(data));
        }
        setShowModal(false);
        dispatch(fetchAllProductsAdmin());
    };

    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        if (deletingId === id) {
            // Confirmed — actually delete
            await dispatch(deleteProduct(id));
            setDeletingId(null);
            dispatch(fetchAllProductsAdmin());
        } else {
            // First click — ask for confirmation
            setDeletingId(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
                <button onClick={openAdd} className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all text-sm">
                    + Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Product</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Price</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Special</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.image || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                                <span className="font-medium text-gray-800">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">{p.category}</td>
                                        <td className="py-3 px-4 font-bold text-red-600">₹{p.price}/{p.unit}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {p.isSpecial && <span className="text-amber-500">⭐</span>}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-700 font-medium mr-3">Edit</button>
                                            {deletingId === p._id ? (
                                                <span className="inline-flex items-center gap-1">
                                                    <button onClick={() => handleDelete(p._id)} className="text-white bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded text-xs font-bold">Yes, Delete</button>
                                                    <button onClick={() => setDeletingId(null)} className="text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded text-xs font-bold">Cancel</button>
                                                </span>
                                            ) : (
                                                <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹) *</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0"
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
                                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all"
                                    placeholder="https://..." />
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                                        className="w-4 h-4 accent-red-600" />
                                    <span className="text-sm font-medium text-gray-700">Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isSpecial} onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                                        className="w-4 h-4 accent-amber-500" />
                                    <span className="text-sm font-medium text-gray-700">⭐ Today's Special</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
                                    {editingId ? 'Update Product' : 'Add Product'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-gray-300 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
