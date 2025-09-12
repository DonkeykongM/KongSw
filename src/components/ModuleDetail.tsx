@@ .. @@
       {/* Header */}
       <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
-        <div className="container mx-auto px-4 sm:px-6 py-4">
+        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
           <div className="flex items-center justify-between">
             <button
               onClick={onBack}
-              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
+              className="flex items-center space-x-1 sm:space-x-2 text-neutral-600 hover:text-primary-600 transition-colors min-h-[48px] px-2 py-2 rounded-lg text-sm sm:text-base"
             >
-              <ArrowLeft className="w-5 h-5" />
-             <span>Tillbaka till kursen</span>
+              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
+             <span className="hidden sm:inline">Tillbaka till kursen</span>
+             <span className="sm:hidden">Tillbaka</span>
             </button>
-            <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent text-center">
+            <h1 className="text-sm sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent text-center px-2 max-w-xs sm:max-w-none truncate">
              {module.title} | Napoleon Hills Tänk och Bli Rik Modul {module.id}
             </h1>
-            <div className="w-24"></div>
+            <div className="w-16 sm:w-24"></div>
           </div>
         </div>
       </div>
@@ -382,7 +382,7 @@
       {/* Tab Navigation */}
       <div className="bg-white border-b">
-        <div className="container mx-auto px-4 sm:px-6">
+        <div className="container mx-auto px-3 sm:px-6">
           <nav className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide pb-1">
             {[
               { id: 'lesson', label: 'Lektion' },
@@ -393,7 +393,7 @@
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
-                className={`py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm lg:text-base transition-all duration-200 whitespace-nowrap min-h-[44px] flex items-center flex-shrink-0 active:bg-gray-100 ${
+                className={`py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap min-h-[48px] flex items-center flex-shrink-0 active:bg-gray-100 ${
                   activeTab === tab.id
                     ? 'border-primary-600 text-primary-600'
                     : 'border-transparent text-neutral-500 hover:text-neutral-700'
@@ -407,9 +407,9 @@
       </div>
 
       {/* Mobile Progress Indicator */}
-      <div className="sm:hidden bg-white border-b px-4 py-2">
-        <div className="flex items-center justify-between text-xs text-gray-600">
-          <span>Modul {module.id} av 13</span>
+      <div className="sm:hidden bg-white border-b px-3 py-2">
+        <div className="flex items-center justify-between text-xs text-gray-600">
+          <span>Vecka {module.id}/13</span>
           <span>{activeTab === 'lesson' ? 'Lektion' : activeTab === 'reflection' ? 'Reflektion' : activeTab === 'quiz' ? 'Quiz' : 'Översikt'}</span>
         </div>
       </div>
@@ -423,7 +423,7 @@
       </div>

       {/* Chatbot Toggle Button */}
-      <div className="fixed bottom-4 right-4 z-[10000]">
+      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[10000]">
         <button
           onClick={toggleChatbot}
-          className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 flex items-center space-x-2 ring-4 ring-blue-300/50 backdrop-blur-sm ${
+          className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-200 hover:scale-110 flex items-center space-x-2 ring-2 sm:ring-4 ring-blue-300/50 backdrop-blur-sm ${
             isChatbotExpanded 
-              ? 'w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-4 border-white text-white shadow-2xl' 
-              : 'p-5 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
+              ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-2 sm:border-4 border-white text-white shadow-2xl' 
+              : 'p-3 sm:p-5 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
           }`}
           title={isChatbotExpanded ? 'Minimera Napoleon Hill AI' : 'Fråga Napoleon Hill AI - Din personliga framgångsmentor'}
         >
           {isChatbotExpanded ? (
             <div className="flex flex-col items-center">
-              <X className="w-6 h-6" />
-              <span className="text-xs font-bold">STÄNG</span>
+              <X className="w-4 h-4 sm:w-6 sm:h-6" />
+              <span className="text-xs font-bold hidden sm:block">STÄNG</span>
             </div>
           ) : (
             <div className="relative">
-              <Brain className="w-8 h-8 text-white animate-pulse" />
-              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce">
-                <MessageCircle className="w-3 h-3 text-white ml-0.5 mt-0.5" />
+              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
+              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-bounce">
+                <MessageCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white ml-0.5 mt-0.5" />
               </div>
             </div>
           )}
         </button>
         
         {!isChatbotExpanded && (
-          <div className="absolute -top-12 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
-            <div className="text-sm font-bold">🧠 Napoleon Hill AI</div>
-            <div className="text-xs opacity-90">Din personliga framgångsmentor</div>
+          <div className="absolute -top-10 sm:-top-12 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-xs sm:text-sm">
+            <div className="font-bold">🧠 Napoleon Hill AI</div>
+            <div className="opacity-90 hidden sm:block">Din personliga framgångsmentor</div>
             <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-900"></div>
           </div>
         )}