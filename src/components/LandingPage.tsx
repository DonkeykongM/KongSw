@@ .. @@
       {/* Header with Login */}
       <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
         <div className="container mx-auto px-4 sm:px-6">
-          <div className="flex items-center justify-between h-16 sm:h-20">
+          <div className="flex items-center justify-between h-16 sm:h-20">
             {/* Logo */}
-            <div className="flex items-center space-x-3">
-              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
-              <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
+            <div className="flex items-center space-x-2 sm:space-x-3">
+              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
+              <span className="text-lg sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                 KongMindset
               </span>
             </div>
             
             {/* Login Button */}
             <button
               onClick={onJoinClick}
-              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2 min-h-[48px]"
+              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center space-x-1 sm:space-x-2 min-h-[48px] text-sm sm:text-base"
             >
-              <span>🔑 Logga in</span>
+              <span className="hidden sm:inline">🔑</span>
+              <span>Logga in</span>
             </button>
           </div>
         </div>
@@ .. @@
       {/* Hero Section */}
-      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
+      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-16 md:pb-24">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-yellow-900/5"></div>
-        <div className="container mx-auto px-4 sm:px-6 relative">
-          <div className="text-center max-w-5xl mx-auto mb-16">
-            <div className="flex items-center justify-center space-x-3 mb-6">
-              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-16 h-16 md:w-20 md:h-20" />
-              <span className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
+        <div className="container mx-auto px-4 sm:px-6 relative">
+          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
+            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
+              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
+              <span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                 KongMindset
               </span>
             </div>
             
-            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight">
+            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight px-2">
               Bemästra Napoleon Hills<br />
-              <span className="text-yellow-600">Rikedomsplan</span>
+              <span className="text-yellow-600 text-2xl sm:text-3xl md:text-5xl lg:text-6xl">Rikedomsplan</span>
             </h1>
             
-            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
+            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto font-light leading-relaxed px-4">
               Få <strong>originalboken GRATIS</strong> plus <strong>Napoleon Hill i din ficka</strong> - världens första AI-mentor baserad på "Tänk och Bli Rik"
             </p>
             
             {/* Special Offer Badge */}
             <button
               onClick={onJoinClick}
-              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-full inline-block mb-8 shadow-2xl animate-pulse transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
+              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 sm:px-6 py-3 rounded-full inline-block mb-6 sm:mb-8 shadow-2xl animate-pulse transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-base sm:text-lg min-h-[48px] flex items-center justify-center"
             >
-              <span className="font-bold text-lg">🔥 2025 KAMPANJ: 299 kr specialpris!</span>
+              <span className="font-bold text-sm sm:text-base md:text-lg">🔥 2025 KAMPANJ: 299 kr!</span>
             </button>