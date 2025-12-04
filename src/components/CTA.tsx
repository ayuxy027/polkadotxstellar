const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-50 mb-4 tracking-tight">
            Ready to unify your Web3 identity?
          </h2>
          <p className="text-lg text-stone-400 max-w-xl mx-auto mb-8">
            Connect your Stellar and Polkadot wallets to check your cross-chain reputation today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-50 text-stone-900 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Connect Wallets
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-stone-300 border border-stone-700 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Learn More
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-6">
            Free reputation check · No registration required
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;