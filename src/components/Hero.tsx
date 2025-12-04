const Hero = () => {
  return (
    <section className="min-h-screen bg-stone-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-200 rounded-full mb-8 animate-fade-in-up"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-sm text-stone-600">Unifying Web3 Identity</span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            Your reputation follows you
            <br />
            <span className="text-stone-500">across chains</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            ChainRepute uses AI to unify your Stellar and Polkadot reputation,
            creating verifiable cross-chain credentials for DeFi, DAOs, and communities.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-stone-50 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Connect Wallets
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <p className="text-sm text-stone-400 mb-6">Trusted across ecosystems</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {['Stellar', 'Polkadot', 'DeFi Protocols', 'DAOs', 'Communities'].map((ecosystem, index) => (
                <span
                  key={ecosystem}
                  className="text-stone-400 font-medium text-lg animate-fade-in-up"
                  style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'both' }}
                >
                  {ecosystem}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div
          className="mt-20 animate-fade-in-up"
          style={{ animationDelay: '600ms', animationFillMode: 'both' }}
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-stone-100 border border-stone-200 rounded-2xl p-2">
              <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-stone-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-stone-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-stone-100 rounded-lg text-xs text-stone-400">
                      chainrepute.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard content placeholder */}
                <div className="p-6 md:p-8 bg-white min-h-[400px]">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { title: 'Stellar Score', value: '450' },
                      { title: 'Polkadot Score', value: '300' },
                      { title: 'Unified Score', value: '750' }
                    ].map((stat, i) => (
                      <div key={stat.title} className="bg-stone-50 border border-stone-100 rounded-xl p-5">
                        <div className="w-10 h-10 bg-stone-200 rounded-lg mb-4"></div>
                        <div className="h-3 bg-stone-200 rounded w-20 mb-2"></div>
                        <h3 className="text-stone-800 font-semibold">{stat.title}</h3>
                        <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-semibold text-stone-800">Cross-Chain Credential</h4>
                      <div className="text-sm text-stone-500">Minted</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { chain: 'Stellar', status: 'Verified' },
                        { chain: 'Polkadot', status: 'Verified' },
                        { chain: 'Reputation', status: '750/1000' },
                        { chain: 'Profile', status: 'Balanced' }
                      ].map((item, i) => (
                        <div key={item.chain} className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-stone-200 rounded-lg"></div>
                          <div className="flex-1 font-medium text-stone-700">{item.chain}</div>
                          <div className={`px-2 py-1 rounded text-sm font-medium ${item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;