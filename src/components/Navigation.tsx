@@ .. @@
         <div className="flex items-center justify-between h-16 sm:h-20">
           {/* Logo */}
-          <div className="flex items-center space-x-3">
-            <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
-            <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
+          <div className="flex items-center space-x-2 sm:space-x-3">
+            <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
+            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
               KongMindset
             </span>
           </div>
@@ .. @@
             {/* User Menu */}
             <div className="flex items-center space-x-4">
-              <div>
+              <div className="hidden md:block">
                 <div className="text-right">
                   <span className="text-sm text-neutral-600">Välkommen, {profile?.display_name || user?.email?.split('@')[0] || 'Användare'}</span>
                   {hasActiveAccess && activeProduct && (
)
}
@@ .. @@
         {/* Mobile menu */}
         {mobileMenuOpen && (
         )
         }
-          <div className="lg:hidden fixed top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
-            <div className="px-4 py-4 space-y-2">
+          <div className="lg:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg z-50 overflow-y-auto">
+            <div className="px-4 py-6 space-y-3">
               {navItems.map(item => {
                 const Icon = item.icon;
                 return (
                 )
}
)
}
@@ -159,7 +159,7 @@
                     key={item.id}
                     onClick={() => handleNavigation(item.id)}
-                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 min-h-[52px] text-base active:scale-95 ${
}
+                    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left font-medium transition-all duration-200 min-h-[60px] text-lg active:scale-95 ${
                       currentPage === item.id
                         ? 'text-primary-600 bg-primary-50 border-2 border-primary-200'
                         : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 border-2 border-transparent'
}
@@ -172,12 +172,22 @@
               })}
               
-              <div className="border-t border-gray-200 pt-3 mt-3">
-                <div className="px-4 py-3 bg-gray-50 rounded-xl mb-3">
+              <div className="border-t border-gray-200 pt-6 mt-6">
+                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-200">
                   <div>
-                    <span className="text-sm font-medium text-neutral-700">Välkommen, {profile?.display_name || user?.email?.split('@')[0] || 'Elev'}</span>
+                    <div className="text-base font-bold text-blue-800 mb-1">
+                      {profile?.display_name || user?.email?.split('@')[0] || 'Elev'}
+                    </div>
+                    <div className="text-sm text-blue-600">
+                      {user?.email}
+                    </div>
                     {hasAccess && activeProduct && (
-                      <div className="text-xs text-green-600 font-medium mt-1">
+                      <div className="text-sm text-green-700 font-semibold mt-2 bg-green-100 px-3 py-1 rounded-full inline-block">
+                        ✅ {activeProduct.name}
+                      </div>
+                    )}
+                    {!hasAccess && (
+                      <div className="text-sm text-orange-700 font-semibold mt-2 bg-orange-100 px-3 py-1 rounded-full inline-block">
                         ✅ {activeProduct.name}
                       </div>
                     )}
@@ -188,7 +198,7 @@
                     onSignOut();
                     setMobileMenuOpen(false);
                   }}
-                  className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[52px] text-base active:scale-95 border-2 border-transparent"
+                  className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left font-bold text-red-600 hover:bg-red-50 transition-colors min-h-[60px] text-lg active:scale-95 border-2 border-red-200 bg-red-50"
                 >
                   <LogOut className="w-6 h-6 flex-shrink-0" />
                   <span>Logga ut</span>