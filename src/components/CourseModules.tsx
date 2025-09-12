@@ .. @@
     <section id="modules" className="py-16 md:py-24 bg-white/50 backdrop-blur-sm">
       <SEOHead
@@ .. @@
       
       <div className="container mx-auto px-4 sm:px-6">
-        <div className="text-center mb-16">
-          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
+        <div className="text-center mb-12 sm:mb-16">
+          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent px-2">
             13 Veckors Transformation: Napoleon Hills Framgångsprinciper
           </h1>
-          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto font-light mb-6">
+          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto font-light mb-4 sm:mb-6 px-4">
             Transformera ditt liv genom 13 veckors systematisk träning baserad på Napoleon Hills tidlösa visdom från "Tänk och Bli Rik." Varje vecka fokuserar på en princip som ska integreras djupt i ditt dagliga liv.
           </p>
           
-          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 max-w-4xl mx-auto border-2 border-amber-200 mb-8">
-            <div className="flex items-center justify-center space-x-3 mb-4">
-              <Clock className="w-8 h-8 text-amber-600" />
-              <h2 className="text-2xl font-bold text-amber-800">13 Veckor Per Princip - Ingen Genväg Till Framgång</h2>
+          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 max-w-4xl mx-auto border-2 border-amber-200 mb-6 sm:mb-8">
+            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
+              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 flex-shrink-0" />
+              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 text-center">13 Veckor Per Princip - Ingen Genväg Till Framgång</h2>
             </div>
-            <p className="text-amber-700 text-lg mb-4 max-w-2xl mx-auto">
+            <p className="text-amber-700 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 max-w-2xl mx-auto text-center">
               Napoleon Hill studerade 500+ miljonärer i 20 år och upptäckte att bestående framgång kräver tid och repetition för att varje princip ska sätta sig i undermedvetandet. 13 veckor ger dig tid att verkligen internalisera varje princip.
             </p>
-            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-600">
-              <div className="bg-white/60 rounded-lg p-3">
+            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-amber-600">
+              <div className="bg-white/70 rounded-lg p-3 sm:p-4">
                 <strong>⏰ Varför 13 veckor?</strong><br/>
                 Hjärnforskning visar att det tar 7-21 dagar att forma nya vanor. Vi ger dig 13 full veckor för att verkligen bemästra alla principer.
               </div>
-              <div className="bg-white/60 rounded-lg p-3">
+              <div className="bg-white/70 rounded-lg p-3 sm:p-4">
                 <strong>🧠 Undermedvetet lärande:</strong><br/>
                 Veckovis fokus och daglig repetition programmerar ditt undermedvetna sinne - grunden till all bestående förändring.
               </div>
@@ -218,7 +218,7 @@
         
-        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
+        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
           {courseContent.map((module) => (
             <ModuleCard 
               key={module.id}
       )
       )
       }