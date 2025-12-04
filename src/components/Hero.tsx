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
            <span className="text-sm text-stone-600">Now available for teams</span>
          </div>

          {/* Heading */}
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            Build products that
            <br />
            <span className="text-stone-500">users love</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            Streamline your workflow with our intuitive platform. 
            Ship faster, collaborate better, and focus on what matters most.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-800 text-stone-50 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Start free trial
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-base font-medium transition-all duration-300 ease-out">
              Watch demo
            </button>
          </div>

          {/* Trust indicators */}
          <div 
            className="animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <p className="text-sm text-stone-400 mb-6">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {['Stripe', 'Notion', 'Linear', 'Vercel', 'Raycast'].map((company, index) => (
                <span 
                  key={company} 
                  className="text-stone-400 font-medium text-lg animate-fade-in-up"
                  style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'both' }}
                >
                  {company}
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
                      app.vertex.io/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content placeholder */}
                <div className="p-6 md:p-8 bg-white min-h-[400px]">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-stone-50 border border-stone-100 rounded-xl p-5">
                        <div className="w-10 h-10 bg-stone-200 rounded-lg mb-4"></div>
                        <div className="h-3 bg-stone-200 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-stone-100 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-4 bg-stone-200 rounded w-32"></div>
                      <div className="h-4 bg-stone-100 rounded w-20"></div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-stone-200 rounded-lg"></div>
                          <div className="flex-1 h-3 bg-stone-100 rounded"></div>
                          <div className="w-16 h-3 bg-stone-200 rounded"></div>
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