@@ .. @@
   return (
   )
-    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6">
-      <div className="w-full max-w-md mx-auto">
+    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 flex items-center justify-center p-4">
+      <div className="w-full max-w-sm sm:max-w-md mx-auto">
         {/* Back Button */}
-        <div className="text-left mb-4 sm:mb-6">
+        <div className="text-left mb-4">
           <button
             onClick={onBack}
-            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors min-h-[48px] text-sm sm:text-base bg-white/80 px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
+            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors min-h-[48px] text-sm bg-white/80 px-3 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
           >
-            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
+            <ArrowLeft className="w-4 h-4" />
             <span>Tillbaka till hemsidan</span>
           </button>
         </div>
 
         {/* Logo and Title */}
-        <div className="text-center mb-6 sm:mb-8">
-          <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4" />
-          <h1 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
+        <div className="text-center mb-6">
+          <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-16 h-16 mx-auto mb-3" />
+          <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
             KongMindset
           </h1>
-          <p className="text-neutral-600 text-sm sm:text-base px-2">
+          <p className="text-neutral-600 text-sm px-2">
             Behärska Napoleon Hills Tänk och Bli Rik-principer
           </p>
         </div>
 
         {/* Auth Form */}
-        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20">
+        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
           <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
             <button
               onClick={() => setIsLogin(true)}
-              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
}
+              className={`flex-1 py-3 px-3 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[48px] ${
                 isLogin
                   ? 'bg-white text-primary-700 shadow-sm'
                   : 'text-neutral-600 hover:text-primary-600'
}
@@ -77,7 +77,7 @@
             </button>
             <button
               onClick={() => setIsLogin(false)}
-              className={`flex-1 py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
}
+              className={`flex-1 py-3 px-3 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[48px] ${
                 !isLogin
                   ? 'bg-white text-primary-700 shadow-sm'
                   : 'text-neutral-600 hover:text-primary-600'
}
@@ -91,7 +91,7 @@
             {/* Email Field */}
             <div>
-              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
+              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                 E-postadress
               </label>
               <div className="relative">
-                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
+                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                 <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
-                  className="w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
+                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                   placeholder="Ange din e-postadress"
                   required
                 />
@@ -111,7 +111,7 @@
 
             {/* Password Field */}
             <div>
-              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
+              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                 Lösenord
               </label>
               <div className="relative">
-                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
+                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                 <input
                   type={showPassword ? 'text' : 'password'}
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
-                  className="w-full pl-9 sm:pl-10 pr-12 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
+                  className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                   placeholder={isLogin ? "Ange ditt lösenord" : "Skapa ett lösenord"}
                   required
                 />
@@ -131,7 +131,7 @@
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[48px] min-w-[48px] flex items-center justify-center"
                 >
-                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
+                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
             </div>
@@ -139,7 +139,7 @@
             {/* Confirm Password Field - Only for signup */}
             {!isLogin && (
                 )
                 }
               <div>
-                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
+                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                   Bekräfta lösenord
                 </label>
                 <div className="relative">
-                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
+                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                   <input
                     type={showConfirmPassword ? 'text' : 'password'}
                     id="confirmPassword"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
-                    className="w-full pl-9 sm:pl-10 pr-12 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
+                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base min-h-[48px]"
                     placeholder="Bekräfta ditt lösenord"
                     required
                   />
@@ -159,7 +159,7 @@
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 min-h-[48px] min-w-[48px] flex items-center justify-center"
                   >
-                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
+                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
               </div>