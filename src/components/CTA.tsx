const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-50 mb-4 tracking-tight">
              Ready to unify your Web3 identity?
            </h2>
            <p className="text-lg text-rose-100 max-w-xl mx-auto mb-8">
              Connect your Stellar and Polkadot wallets to check your cross-chain reputation today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-900 rounded-xl text-base font-medium transition-all duration-300 ease-out hover:from-white hover:to-rose-50 hover:shadow-2xl hover:shadow-rose-900/30 hover:-translate-y-0.5">
                Connect Wallets
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-rose-950/50 text-rose-100 border border-rose-300/30 rounded-xl text-base font-medium transition-all duration-300 ease-out hover:bg-rose-950/70 hover:border-rose-300/50 hover:shadow-lg hover:shadow-rose-900/20 hover:-translate-y-0.5">
                Learn More
              </button>
            </div>
            <p className="text-sm text-rose-200 mt-6">
              Free reputation check · No registration required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;