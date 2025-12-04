const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-rose-900 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-50 mb-4 tracking-tight">
            Ready to unify your Web3 identity?
          </h2>
          <p className="text-lg text-rose-200 max-w-xl mx-auto mb-8">
            Connect your Stellar and Polkadot wallets to check your cross-chain reputation today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-rose-50 text-rose-900 rounded-xl text-base font-medium transition-all duration-300 ease-out hover:bg-rose-100">
              Connect Wallets
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-rose-800 text-rose-100 border border-rose-700 rounded-xl text-base font-medium transition-all duration-300 ease-out hover:bg-rose-700">
              Learn More
            </button>
          </div>
          <p className="text-sm text-rose-300 mt-6">
            Free reputation check · No registration required
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;