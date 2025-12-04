const Features = () => {
  const features = [
    {
      title: 'Cross-Chain Integration',
      description: 'Unified reputation scanning across Stellar and Polkadot blockchains with a single interface.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m13.14 0H18.75M8.25 10.5h6m-6 3h6m-6-9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3H2.75" />
        </svg>
      ),
    },
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze on-chain behavior patterns for accurate reputation scoring.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 21a4.375 4.375 0 003 0m4.5-4.367a4.367 4.367 0 001.5-3.033V9.75m-4.5 3.75l4.5-3.75m0 0L21 9.75m-9 3.75h3.75m-9 0V6.568a2.25 2.25 0 011.195-1.99L9.75 2.25a2.25 2.25 0 012.1 0l6.204 2.326a2.25 2.25 0 011.195 1.995V21M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5" />
        </svg>
      ),
    },
    {
      title: 'Verifiable Credentials',
      description: 'Soulbound tokens and on-chain storage ensure reputation credentials are tamper-proof.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'DeFi Integration',
      description: 'Access undercollateralized loans and better rates based on your unified cross-chain reputation.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'DAO Governance',
      description: 'Enhanced voting power in DAOs based on your cross-chain governance participation history.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3.068 1.018m3.068-1.018a3.089 3.089 0 00-.785 1.158c-.179.3-.28.648-.28 1.03 0 .382.101.73.28 1.03a3.09 3.09 0 00.785 1.158c.243.19.507.32.785.396m7.032 0c.194.066.385.11.574.131m-7.032 0a3.088 3.088 0 01.785-.396c.243-.19.486-.42.688-.678c.194-.25.324-.54.393-.863a3.08 3.08 0 01-.633-2.841m0 0c.179.3.28.648.28 1.03a3.09 3.09 0 01-.28 1.03m0-3.09a3.089 3.089 0 00-.785-1.158c-.243-.19-.507-.32-.785-.396" />
        </svg>
      ),
    },
    {
      title: 'Community Access',
      description: 'Prove your Web3 identity for exclusive communities, airdrops, and access to gated content.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-rose-600 mb-4">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4 tracking-tight">
            Everything you need for cross-chain reputation
          </h2>
          <p className="text-lg text-rose-700">
            Powerful features designed to unify your Web3 identity across ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 bg-rose-50 border border-rose-100 rounded-2xl transition-all duration-500 ease-out animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-700 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-rose-900 mb-2">{feature.title}</h3>
              <p className="text-rose-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;