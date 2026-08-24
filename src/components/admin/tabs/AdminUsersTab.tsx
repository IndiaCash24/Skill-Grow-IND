import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  Shield,
  Award,
  Edit2,
  DollarSign,
  Ban,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  ChevronDown,
  Download,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { AdminUserRecord } from '../../../types';

interface AdminUsersTabProps {
  users: AdminUserRecord[];
  onUpdateUser: (updatedUser: AdminUserRecord) => void;
  onAddUser: (newUser: AdminUserRecord) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUser,
  onAddUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [kycFilter, setKycFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [balanceModalUser, setBalanceModalUser] = useState<AdminUserRecord | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState<number>(0);
  const [balanceAdjustType, setBalanceAdjustType] = useState<'credit' | 'debit'>('credit');
  const [balanceAdjustReason, setBalanceAdjustReason] = useState<string>('');

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<Partial<AdminUserRecord>>({
    name: '',
    email: '',
    phone: '',
    packageTier: 'PLATINUM PACKAGE',
    role: 'affiliate',
    status: 'active',
    sponsorCode: 'SGIND0023',
    sponsorName: 'SURENDRA KUMAR',
    state: 'Delhi NCR',
    walletBalance: 0,
    kycStatus: 'Verified',
  });

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.sponsorCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTier = tierFilter === 'ALL' || u.packageTier.toUpperCase().includes(tierFilter);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchKyc = kycFilter === 'ALL' || u.kycStatus === kycFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchSearch && matchTier && matchRole && matchKyc && matchStatus;
  });

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser);
    setEditingUser(null);
  };

  const handleApplyBalanceAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalUser || balanceAdjustAmount <= 0) return;

    const diff = balanceAdjustType === 'credit' ? balanceAdjustAmount : -balanceAdjustAmount;
    const newBal = Math.max(0, balanceModalUser.walletBalance + diff);
    const newAllTime =
      balanceAdjustType === 'credit'
        ? balanceModalUser.allTimeEarnings + balanceAdjustAmount
        : balanceModalUser.allTimeEarnings;

    const updated: AdminUserRecord = {
      ...balanceModalUser,
      walletBalance: newBal,
      allTimeEarnings: newAllTime,
    };

    onUpdateUser(updated);
    setBalanceModalUser(null);
    setBalanceAdjustAmount(0);
    setBalanceAdjustReason('');
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.phone) return;

    const generatedCode = `SGIND0${Math.floor(100 + Math.random() * 900)}`;
    const fullNewUser: AdminUserRecord = {
      id: `u-${Date.now()}`,
      userCode: generatedCode,
      name: newUserData.name || '',
      email: newUserData.email || '',
      phone: newUserData.phone || '',
      role: newUserData.role || 'affiliate',
      packageTier: newUserData.packageTier || 'PLATINUM PACKAGE',
      status: newUserData.status || 'active',
      sponsorCode: newUserData.sponsorCode || 'SGIND0023',
      sponsorName: newUserData.sponsorName || 'SURENDRA KUMAR',
      walletBalance: Number(newUserData.walletBalance) || 0,
      allTimeEarnings: Number(newUserData.walletBalance) || 0,
      todayEarnings: 0,
      totalWithdrawn: 0,
      kycStatus: newUserData.kycStatus || 'Verified',
      joinDate: 'Today, 2024',
      state: newUserData.state || 'Delhi NCR',
      upiId: `${newUserData.name?.toLowerCase().replace(/\s+/g, '')}@okaxis`,
    };

    onAddUser(fullNewUser);
    setIsAddUserModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      phone: '',
      packageTier: 'PLATINUM PACKAGE',
      role: 'affiliate',
      status: 'active',
      sponsorCode: 'SGIND0023',
      state: 'Delhi NCR',
    });
  };

  const exportUsersCsv = () => {
    const headers = 'User Code,Name,Email,Phone,Role,Package,Status,KYC,Wallet Balance,All Time Earnings,Sponsor Code\n';
    const rows = filteredUsers
      .map(
        (u) =>
          `"${u.userCode}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.packageTier}","${u.status}","${u.kycStatus}",${u.walletBalance},${u.allTimeEarnings},"${u.sponsorCode}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillGrow_Users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Affiliates & Students Directory</h2>
            <p className="text-xs text-slate-500">
              Manage affiliate accounts, packages, wallet balances, roles, and downlines.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportUsersCsv}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Code, Email, Phone, Sponsor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
            />
          </div>

          {/* Package Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All Packages</option>
              <option value="PLATINUM">Platinum</option>
              <option value="DIAMOND">Diamond</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="admin">Super Admin</option>
              <option value="mentor">Mentor</option>
              <option value="affiliate">Affiliate</option>
            </select>
          </div>

          {/* KYC Status Filter */}
          <div>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-700 font-semibold"
            >
              <option value="ALL">All KYC Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role & Package</th>
                <th className="py-3.5 px-4">Sponsor Info</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4">Wallet Balance</th>
                <th className="py-3.5 px-4">All-Time Earnings</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No affiliates found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{user.name}</span>
                            <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {user.userCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Package */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            user.role === 'admin'
                              ? 'bg-rose-100 text-rose-800'
                              : user.role === 'mentor'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                        <div className="font-semibold text-slate-800 text-[11px]">{user.packageTier}</div>
                      </div>
                    </td>

                    {/* Sponsor Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{user.sponsorName || 'Direct'}</div>
                      <div className="text-[10px] text-slate-400">{user.sponsorCode}</div>
                    </td>

                    {/* KYC Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          user.kycStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.kycStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : user.kycStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>

                    {/* Wallet Balance */}
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{user.walletBalance.toLocaleString('en-IN')}
                    </td>

                    {/* All-Time Earnings */}
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      ₹{user.allTimeEarnings.toLocaleString('en-IN')}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setBalanceModalUser(user);
                            setBalanceAdjustAmount(1000);
                          }}
                          title="Credit/Debit Wallet"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingUser(user)}
                          title="Edit User Profile & Tier"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            const newStatus = user.status === 'active' ? 'suspended' : 'active';
                            onUpdateUser({ ...user, status: newStatus });
                          }}
                          title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Edit User Profile */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Edit User Account</h3>
                <p className="text-xs text-slate-300">Code: {editingUser.userCode}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="affiliate">Affiliate</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Active Package</label>
                  <select
                    value={editingUser.packageTier}
                    onChange={(e) => setEditingUser({ ...editingUser, packageTier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="PLATINUM PACKAGE">Platinum Package</option>
                    <option value="DIAMOND PACKAGE">Diamond Package</option>
                    <option value="GOLD PACKAGE">Gold Package</option>
                    <option value="SILVER PACKAGE">Silver Package</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">KYC Status</label>
                  <select
                    value={editingUser.kycStatus}
                    onChange={(e) => setEditingUser({ ...editingUser, kycStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Not Submitted">Not Submitted</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="active">Active (Full Access)</option>
                    <option value="suspended">Suspended (Blocked)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Credit / Debit Wallet Balance */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Adjust User Wallet Balance</h3>
                <p className="text-xs text-slate-300">
                  {balanceModalUser.name} ({balanceModalUser.userCode})
                </p>
              </div>
              <button
                onClick={() => setBalanceModalUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyBalanceAdjust} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-600">Current Balance:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{balanceModalUser.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceAdjustType('credit')}
                    className={`py-2 text-xs font-black rounded-xl border transition-all ${
                      balanceAdjustType === 'credit'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Credit (Add Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceAdjustType('debit')}
                    className={`py-2 text-xs font-black rounded-xl border transition-all ${
                      balanceAdjustType === 'debit'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    - Debit (Deduct Money)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Adjustment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={balanceAdjustAmount || ''}
                  onChange={(e) => setBalanceAdjustAmount(Number(e.target.value))}
                  placeholder="Enter amount (e.g. 5000)"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Note for Audit</label>
                <input
                  type="text"
                  value={balanceAdjustReason}
                  onChange={(e) => setBalanceAdjustReason(e.target.value)}
                  placeholder="e.g. Contest winner bonus / Manual bonus adjustment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl font-bold shadow-md ${
                    balanceAdjustType === 'credit'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  }`}
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="font-black text-base">Register New Affiliate / Student</h3>
                <p className="text-xs text-slate-300">Generate account directly with immediate package access</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    placeholder="e.g. Harshita Singh"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="harshita@gmail.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enrolled Package</label>
                  <select
                    value={newUserData.packageTier}
                    onChange={(e) => setNewUserData({ ...newUserData, packageTier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold bg-white"
                  >
                    <option value="PLATINUM PACKAGE">Platinum Package (₹9,999)</option>
                    <option value="DIAMOND PACKAGE">Diamond Package (₹5,999)</option>
                    <option value="GOLD PACKAGE">Gold Package (₹2,999)</option>
                    <option value="SILVER PACKAGE">Silver Package (₹1,499)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sponsor Code</label>
                  <input
                    type="text"
                    value={newUserData.sponsorCode}
                    onChange={(e) => setNewUserData({ ...newUserData, sponsorCode: e.target.value })}
                    placeholder="SGIND0023"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newUserData.state}
                    onChange={(e) => setNewUserData({ ...newUserData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Wallet (₹)</label>
                  <input
                    type="number"
                    value={newUserData.walletBalance || ''}
                    onChange={(e) => setNewUserData({ ...newUserData, walletBalance: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
