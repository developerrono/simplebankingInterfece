import React, { useState, useEffect } from 'react';
import { Home, Clock, User, Settings, Menu, X, ArrowUpRight, ArrowDownLeft, Send, RefreshCw, TrendingUp, Filter, Wallet, Code, Mail, Trash2, AlertTriangle } from 'lucide-react';

const JamiiBank = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  type User = { name: string; email: string } | null;
  const [user, setUser] = useState(null as User);
  const [balance, setBalance] = useState(0);
  type Transaction = {
    id: number;
    type: string;
    amount: number;
    date: string;
    details: string;
  };
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [saasFilter, setSaasFilter] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const cryptoRate = 0.0000065;

  // Changed localStorage keys to 'jamiibank_'
  useEffect(() => {
    const savedUser = localStorage.getItem('jamiibank_user');
    const savedBalance = localStorage.getItem('jamiibank_balance');
    const savedTxns = localStorage.getItem('jamiibank_transactions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setBalance(parseFloat(savedBalance ?? '0') || 0);
      setTransactions(JSON.parse(savedTxns ?? '[]'));
    }
  }, []);

  // Changed localStorage keys to 'jamiibank_'
  useEffect(() => {
    if (user) {
      localStorage.setItem('jamiibank_user', JSON.stringify(user));
      localStorage.setItem('jamiibank_balance', balance.toString());
      localStorage.setItem('jamiibank_transactions', JSON.stringify(transactions));
    }
  }, [user, balance, transactions]);

  const handleSignup = () => {
    if (signupName && signupEmail) {
      setUser({ name: signupName, email: signupEmail });
      setIsSignupOpen(false);
      setSignupName('');
      setSignupEmail('');
    }
  };

  const addTransaction = (type: string, amt: number | string, details = '') => {
    const txn = {
      id: Date.now(),
      type,
      amount: parseFloat(String(amt)),
      date: new Date().toLocaleString(),
      details
    };
    setTransactions([txn, ...transactions]);
  };

  const handleTransaction = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    switch(modalType) {
      case 'Deposit':
        setBalance(balance + amt);
        addTransaction('Deposit', amt);
        break;
      case 'Withdraw':
        if (amt <= balance) {
          setBalance(balance - amt);
          addTransaction('Withdraw', amt);
        } else {
          alert('Insufficient balance');
          return;
        }
        break;
      case 'Transfer':
        if (!recipient) {
          alert('Please enter recipient');
          return;
        }
        if (amt <= balance) {
          setBalance(balance - amt);
          addTransaction('Transfer', amt, `To: ${recipient}`);
        } else {
          alert('Insufficient balance');
          return;
        }
        break;
      case 'Exchange':
        if (amt <= balance) {
          const btc = (amt * cryptoRate).toFixed(8);
          addTransaction('Exchange', amt, `Converted to ${btc} BTC`);
        } else {
          alert('Insufficient balance');
          return;
        }
        break;
      default:
        break;
    }

    setAmount('');
    setRecipient('');
    setShowModal(false);
  };

  // Changed localStorage keys to 'jamiibank_'
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setUser(null);
      setBalance(0);
      setTransactions([]);
      localStorage.removeItem('jamiibank_user');
      localStorage.removeItem('jamiibank_balance');
      localStorage.removeItem('jamiibank_transactions');
    }
  };

  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
    setAmount('');
    setRecipient('');
  };

  const getTransactionIcon = (type: 'Deposit' | 'Withdraw' | 'Transfer' | 'Exchange') => {
    switch(type) {
      case 'Deposit': return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'Withdraw': return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'Transfer': return <Send className="w-5 h-5 text-blue-500" />;
      case 'Exchange': return <RefreshCw className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hamburger Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl" style={{animation: 'slideLeft 0.3s ease-out'}}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!user && (
                <button
                  onClick={() => {
                    setIsSignupOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full mb-6 p-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Sign Up / Login
                </button>
              )}

              <div className="space-y-3">
                {user && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Profile</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('home');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                    >
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Wallet</p>
                        <p className="text-sm text-blue-600">Ksh {balance.toLocaleString()}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('settings');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-800">Settings</span>
                    </button>
                  </>
                )}

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold text-gray-800">Developer</p>
                  </div>
                  <p className="text-sm text-gray-600 italic">Smart Banking in Ksh, by Developer Jamii</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <button onClick={() => setIsSignupOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none transition"
            />
            
            <input
              type="email"
              placeholder="Email Address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-6 focus:border-blue-500 focus:outline-none transition"
            />
            
            <button
              onClick={handleSignup}
              className="w-full p-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{modalType}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <input
              type="number"
              placeholder="Amount (Ksh)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none transition"
            />
            
            {modalType === 'Transfer' && (
              <input
                type="text"
                placeholder="Recipient username"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none transition"
              />
            )}
            
            {modalType === 'Exchange' && amount && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600">Exchange Rate: 1 Ksh = {cryptoRate} BTC</p>
                <p className="text-lg font-semibold text-blue-600 mt-2">≈ {(parseFloat(amount) * cryptoRate).toFixed(8)} BTC</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 p-4 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTransaction}
                className="flex-1 p-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Jamii Bank</h1>
                <p className="text-sm text-gray-500">Smart Banking in Ksh</p>
              </div>
              <button onClick={() => setIsMenuOpen(true)} className="p-3 hover:bg-gray-100 rounded-full transition">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {user ? (
              <>
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 mb-6 shadow-xl text-white">
                  <p className="text-sm opacity-90 mb-2">Available Balance</p>
                  <h2 className="text-5xl font-bold mb-4">Ksh {balance.toLocaleString()}</h2>
                  <p className="text-sm opacity-75">Account: {user.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={() => openModal('Deposit')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
                    <ArrowDownLeft className="w-8 h-8 text-green-500 mb-3" />
                    <span className="font-semibold text-gray-700">Deposit</span>
                  </button>
                  <button onClick={() => openModal('Withdraw')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
                    <ArrowUpRight className="w-8 h-8 text-red-500 mb-3" />
                    <span className="font-semibold text-gray-700">Withdraw</span>
                  </button>
                  <button onClick={() => openModal('Transfer')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
                    <Send className="w-8 h-8 text-blue-500 mb-3" />
                    <span className="font-semibold text-gray-700">Transfer</span>
                  </button>
                  <button onClick={() => openModal('Exchange')} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-purple-500 mb-3" />
                    <span className="font-semibold text-gray-700">Exchange</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-800">Web3 & SaaS Tools</h3>
                    </div>
                    <button onClick={() => setSaasFilter(!saasFilter)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">{saasFilter ? 'Premium ON' : 'Premium OFF'}</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm text-gray-600">Ksh → BTC</span>
                      <span className="text-sm font-semibold">0.0000065</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded-xl">
                      <span className="text-sm text-gray-600">Ksh → ETH</span>
                      <span className="text-sm font-semibold">0.000043</span>
                    </div>
                    {saasFilter && (
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                        <p className="text-sm font-semibold text-orange-800">✨ Premium Banking Tools Active</p>
                        <p className="text-xs text-gray-600 mt-1">Advanced analytics, expense tracking & more</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to Jamii Bank</h2>
                <p className="text-gray-500 mb-6">Please sign up to start banking</p>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transactions Page */}
        {currentPage === 'transactions' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
            
            {transactions.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div key={txn.id} className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-full">
                        {getTransactionIcon(txn.type as 'Deposit' | 'Withdraw' | 'Transfer' | 'Exchange')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{txn.type}</p>
                        <p className="text-xs text-gray-500">{txn.date}</p>
                        {txn.details && <p className="text-xs text-gray-400">{txn.details}</p>}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${txn.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'Deposit' ? '+' : '-'}Ksh {txn.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Page */}
        {currentPage === 'profile' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
            
            {user ? (
              <div className="bg-white rounded-3xl p-8 shadow-md mb-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Account Holder</p>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Current Balance</p>
                      <p className="font-semibold text-blue-600 text-xl">Ksh {balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">Please sign up first</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Page */}
        {currentPage === 'settings' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="font-bold text-gray-800 mb-4">About</h3>
              <p className="text-gray-600 text-sm mb-2">Jamii Bank v1.0</p>
              <p className="text-gray-500 text-sm italic">Smart Banking in Ksh, by Developer Rono</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Account Information</h3>
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Logged in as: <span className="font-semibold">{user.name}</span></p>
                  <p className="text-sm text-gray-600">Email: <span className="font-semibold">{user.email}</span></p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not logged in</p>
              )}
            </div>

            <div className="bg-red-50 rounded-2xl p-6 shadow-md border-2 border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-800">Danger Zone</h3>
              </div>
              <button 
                onClick={handleClearData}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition font-semibold"
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">© 2025 Developer Rono. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-20 px-4">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
              currentPage === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('transactions')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
              currentPage === 'transactions' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>
          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
              currentPage === 'profile' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
              currentPage === 'settings' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

    </div>
  );
};

export default JamiiBank;