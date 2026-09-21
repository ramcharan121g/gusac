import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  Plane,
  Bot,
  Zap,
  Layers,
  Activity,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  X,
  Package,
  Wrench,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Makerspace() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', 'Edge AI & Vision', 'Avionics & UAV', 'Sensors & SLAM', 'Power & Propulsion', 'Fabrication & 3D Print', 'Test & Measurement'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/inventory');
      setInventory(data.inventory || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-red-400" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-yellow-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-pink-400" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-blue-400" />;
      default:
        return <Package className="w-6 h-6 text-slate-400" />;
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request hardware component checkouts.');
      return;
    }

    setCheckoutError('');
    setCheckoutMsg('');
    setSubmitting(true);

    try {
      const res = await apiRequest('/inventory/request', {
        method: 'POST',
        body: {
          inventoryId: selectedItem.id,
          projectName
        }
      });
      setCheckoutMsg(res.message);
      fetchInventory();
      setTimeout(() => {
        setSelectedItem(null);
        setCheckoutMsg('');
        setProjectName('');
      }, 2200);
    } catch (err) {
      setCheckoutError(err.message || 'Failed to checkout hardware');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = inventory.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wing.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-400 mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Makerspace Hardware Inventory &amp; FabLab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            GUSAC Hardware Component Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access industrial flight controllers, NVIDIA edge computing modules, LiDAR scanners, and Bambu 3D printers for your project.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl self-start md:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Lab Keycard Access: <strong>OPEN 24/7</strong></span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none text-xs font-mono">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search component, MCU, sensor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-mono animate-pulse">
          Loading hardware inventory catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between glass-card-hover space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                    {getItemIcon(item.imageIcon)}
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                    item.availableQty > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {item.availableQty} / {item.totalQty} Available
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block font-bold">
                    {item.category} • {item.wing}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed bg-black/40 p-2.5 rounded-xl border border-slate-800/80">
                    {item.specs}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">14-day checkout</span>
                <button
                  onClick={() => setSelectedItem(item)}
                  disabled={item.availableQty <= 0}
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-mono text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                >
                  {item.availableQty > 0 ? 'Request Checkout' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0c101a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Hardware Checkout Request</h3>
                  <p className="text-xs text-slate-400 font-mono">GUSAC Labs Component Dispenser</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono space-y-1">
                <p className="text-white font-bold">{selectedItem.name}</p>
                <p className="text-slate-400">{selectedItem.specs}</p>
                <p className="text-blue-400">Location: {selectedItem.location}</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Project Title / R&amp;D Initiative *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Rocker-Bogie Rover"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {checkoutError && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-mono">
                  {checkoutError}
                </p>
              )}

              {checkoutMsg && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {checkoutMsg}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  {submitting ? 'Allocating...' : 'Confirm Checkout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
