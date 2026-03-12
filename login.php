<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>Login or Register | Getwayrom</title>
<!-- Favicon -->
<link rel="shortcut icon" type="image/x-icon" href="assets/images/logo/primal_favicon.png" />

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800&amp;display=swap" rel="stylesheet" />

<link rel="stylesheet" href="assets/css/vendor/plugins.min.css">
<link rel="stylesheet" href="assets/css/style.min.css">
<link rel="stylesheet" href="assets/css/responsive.min.css">
<style>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

/* Make phone code + phone in one line */
.phone-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Control how the select appears in normal state */
.phone-field select {
  min-width: 140px;
  max-width: 200px;
  padding: 10px;
  cursor: pointer;
  /* For browsers that support it, prevent the native dropdown from being gigantic */
  -webkit-appearance: menulist-button;
  appearance: menulist-button;
}

/* Phone input styling to match */
.phone-field input[type="number"] {
  flex: 1;
  padding: 10px;
}

/* When the select expands (size>1) make it display as a scrollable box */
.phone-field select[size] {
  overflow-y: auto;
  /* limit height */
  max-height: 220px;
}

/* Small responsive adjustments */
@media (max-width: 480px) {
  .phone-field {
    flex-direction: column;
    align-items: stretch;
  }
  .phone-field select, .phone-field input[type="number"] {
    width: 100%;
  }
}
.list{
    height: 206px !important;
    overflow: auto !important;
}
.nice-select{
    margin-top: -28px !important;
}
</style>
</head>
<body>
<div id="main">
    
    <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="google-adsense-account" content="ca-pub-4487657277349772">
      <title>Getwayrom</title>
      <!-- Favicon -->
      <link rel="shortcut icon" type="image/x-icon" href="assets/images/logo/primal_favicon.png">
      <!-- CSS Files -->
      <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.1.1/css/all.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800&display=swap" rel="stylesheet">
      <!--<link rel="stylesheet" href="assets/css/vendor/plugins.min.css">-->
      <link rel="stylesheet" href="assets/css/style.min.css">
      <link rel="stylesheet" href="assets/css/responsive.min.css">
      <!-- Custom Styles -->
      <style>
         /* Core Styles */
         #scrollUp {
         background-color: #1574d6;
         background: linear-gradient(to right,#de57e5 0%,#8863fb 100%);
         background: #859f1b;
         }
         .desc-listcategoreis a i, 
         .desc-listcategoreis a:hover,
         .login-register-wrapper .login-register-tab-list a.active h4 { 
         color: #1574d6; 
         }
         .footer-herading:after { 
         background: #859f1b; 
         }
         .dropdown_search { 
         border: 2px solid #1574d6; 
         }
         .dropdown_search form button { 
         background: #1574d6; 
         }

         /* Layout & Positioning */
         .header-right-nav ul li.dropdown {
         position: relative;
         top: 0px;
         }
         .refresh_btn {
         border: 1px solid transparent;
         background: transparent;
         }
         .mini-cart-content {
         width: 300px;
         padding: 0 15px 15px 15px;
         }
         .mini-cart-content ul {
         padding-top: 10px;
         overflow: auto;
         overflow-x: hidden;
         max-height: 240px;
         }
         /* Shopping Cart Styles */
         .single-shopping-cart { 
         padding: 8px 0; 
         }
         .shopping-cart-img {
         margin: 0 10px 0 0;
         max-width: 70px;
         }
         .shopping-cart-img a img { 
         max-width: 60px; 
         }
         .shopping-cart-title h4 a {
         font-size: 12px;
         line-height: 20px;
         }
         .shopping-cart-title>span {
         margin: 0;
         font-size: 12px;
         }
         .shopping-cart-total {
         margin: 10px 0;
         }
         .shopping-cart-total h4 {
         font-size: 14px;
         line-height: 20px;
         }
         .shopping-cart-btn .default-btn {
         background: #69a909;
         color: #fff;
         }
         /* Form Elements */
         input[type=number]::-webkit-inner-spin-button, 
         input[type=number]::-webkit-outer-spin-button { 
         -webkit-appearance: none; 
         margin: 0; 
         }
         .signin_modal_body .form-group label {
         text-align: left;
         display: block;
         width: 100%;
         }
         .signin_modal_body .form-group label:before {
         display: none;
         }
         
         /* Animations */
         .blink_me {
         animation: blinker 1s linear infinite;
         }
         @keyframes blinker {
         50% { opacity: 0; }
         }
         @keyframes marquee {
         0% { transform: translateX(100%); }
         100% { transform: translateX(-100%); }
         }
         /* Responsive */
         .marquee-container {
         width: calc(100% - 260px);
         margin-left: 20px;
         overflow: hidden;
         position: relative;
         }
         .marquee {
         display: inline-block;
         white-space: nowrap;
         padding-left: 100%;
         animation: marquee 35s linear infinite;
         }
         @media only screen and (max-width: 480px) {
         .logo img {
         height: 32px;
         margin: 12px 0;
         }
         .static-area {
         padding: 0;
         }
         }
         .alert {
         padding: 15px;
         margin-bottom: 20px;
         border: 1px solid transparent;
         border-radius: 4px;
         }
         .alert-danger {
         color: #721c24;
         background-color: #f8d7da;
         border-color: #f5c6cb;
         }
         .alert-info {
         color: #0c5460;
         background-color: #d1ecf1;
         border-color: #bee5eb;
         }
         .login-toggle-btn {
         margin-bottom: 20px;
         }
         .login-toggle-btn input[type="checkbox"] {
         margin-right: 5px;
         }
         .login-toggle-btn a {
         margin-left: 10px;
         color: #666;
         }
         /* Notification Styles */
         @keyframes favicon-flash {
         0%, 100% { opacity: 1; }
         50% { opacity: 0; }
         }
         .favicon-notification {
         animation: favicon-flash 1s infinite;
         }
         /* Add to existing style block */
         :root {
         --notification-color: #ff4444;
         --notification-text-color: #ffffff;
         }
         /* Error Prevention Styles */
         img[src*="wap/upload/products/"],
         img[src*="upload/slider/"],
         img[src=""],
         img:not([src]) {
         opacity: 0;
         position: absolute;
         left: -9999px;
         }
         .header-banner {
         min-height: 60px;
         background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
         display: flex;
         align-items: center;
         justify-content: center;
         color: #6c757d;
         font-size: 14px;
         border-radius: 8px;
         border: 2px dashed #dee2e6;
         }
      </style>
   </head>
   <body>
      <div id="main">
         <header class="main-header">
            <!-- Top Header Banner -->
            <div class="header-navigation">
               <div>
                  <div class="top_header_text" style="position: relative; padding: 18px; color: #fff; background-color: #222; display: flex; align-items: center;">
                     <!-- Logo -->
                     <div style="flex-shrink: 0;">
                        <img src="assets/images/logo/getwayrom_logo.png" alt="Getwayrom Logo" style="width: 260px; height:40px;">
                     </div>
                     <!-- Marquee Announcement -->
                     <div class="marquee-container" style="flex-grow: 1; overflow: hidden; position: relative;">
                        <div class="marquee" style="display: inline-block; white-space: nowrap; animation: marquee 35s linear infinite; will-change: transform;">
                           <p style="display: inline-block; background-color: #dc2430; padding: 10px 20px; font-size: 18px; color: #ffffff; border-radius: 10px; margin: 0;">
                              We are grateful for the continued support from our community. An average of 30 to 40 customers download our *Single File* packages daily. Thank you for choosing us and being a part of our journey! â€" 
                              <span style='color:#FEE715; font-size:21px;'>Getwayrom.com</span>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- Registration Banner -->
            <div class="top_header_text_area">
               <div class="top_header_text">
                  <p>TIRED? TO AVAIL BEST DEALER PRICE REGISTER & COMPLETE THE SIGNUP FORM!</p>
               </div>
            </div>
            <!-- Main Header Area -->
            <div class="middle_header_area">
   <div class="container">
      <div class="row align-items-center">
         <!-- Logo Area -->
         <div class="col-md-2 col-sm-3">
            <div class="logo">
               <a href="https://getwayrom.com/">
                  <img src="https://getwayrom.com/assets/images/logo/getwayrom_logo.png" 
                       class="logo_img" 
                       alt="Getwayrom Logo"
                       style="max-height:60px;">
               </a>
            </div>
         </div>

         <!-- Video Banner Area -->
         <div class="col-md-6 col-sm-5">
            <div class="">
                              <video autoplay muted loop playsinline 
                      style="width:100%; height:auto; border-radius:4px; display:block;">
                  <source src="https://getwayrom.com/upload/887138GETWAYROM BUY.mp4" type="video/mp4">
                  Your browser does not support the video tag.
               </video>
            </div>
         </div>

         <!-- Account & Cart Area -->
         <div class="col-md-4 col-sm-4">
            <div class="header_account_area d-flex justify-content-end">
               <div class="right_header_account_area d-flex align-items-center">
                  <!-- User Account Section -->
                  <div class="sign_in_up_area">
                                          <!-- Guest View -->
                     <a href="#" class="sign_in_link" data-toggle="modal" data-target="#signinModal">
                     <span class="icon"><i class="fa fa-sign-in"></i></span>
                     <span class="txt">Sign In</span>
                     </a>
                     <a href="https://getwayrom.com/login.php">
                     <span class="icon"><i class="fa fa-user-o"></i></span>
                     <span class="txt">Create Account</span>
                     </a>
                                       </div>
                  <!-- Shopping Cart Section -->
                  <div class="cart-info d-flex">
                     <div class="mini-cart-warp">
                        <a href="javascript:void(0)" class="count-cart" data-count="0">
                           <i class="fa fa-shopping-cart"></i>
                           <span class="cart-count">0</span>
                        </a>
                        <div class="mini-cart-content">
                           <ul>
                                                               <li class="single-shopping-cart">
                                    <p>Your cart is empty</p>
                                 </li>
                                                         </ul>
                           <div class="shopping-cart-total">
                              <h4>Total: ₹0</h4>
                           </div>
                           <div class="shopping-cart-btn">
                              <a href="cart.php" class="default-btn">View Cart</a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

            <style>
               .middle_header_area {
               padding: 15px 0;
               }
               .logo img {
               max-height: 60px;
               width: auto;
               }
               .sign_in_up_area {
               display: flex;
               flex-direction: column;
               align-items: flex-end;
               }
               .sign_in_up_area a {
               margin-bottom: 5px;
               }
               .cart-info {
               margin-left: 15px;
               }
               @media (max-width: 767px) {
               .header_account_area {
               justify-content: center;
               margin-top: 15px;
               }
               .sign_in_up_area {
               align-items: center;
               }
               }
               .marquee-set {
               overflow: hidden;
               white-space: nowrap;
               position: relative;
               width: 100%;
               padding: 10px 0;
               }
               .marquee-set .marquee-content {
               display: inline-flex;
               white-space: nowrap;
               will-change: transform;
               animation: marquee-slide 20s linear infinite;
               }
               @keyframes marquee-slide {
               0%   { transform: translateX(0); }
               100% { transform: translateX(-50%); }
               }
               .marquee-set .mq-file-item {
               display: inline-block;
               padding-right: 4em;
               flex-shrink: 0;
               }
               .marquee-set .marquee-content .mq-file-item {
               margin: 0;
               }
            </style>
            <!-- Navigation Area -->
            <div class="navigation_area sticky-nav">
               <div class="container">
                  <div class="row">
                     <div class="col-md-12 col-sm-12 col-12">
                        <div class="navigation_areainner">
                           <!-- Desktop Navigation -->
                           <div class="main-navigation d-none d-lg-block">
                              <ul class="nav_menu_list">
                                 <li><a href="https://getwayrom.com/">Home</a></li>
                                 <li><a href="firmware.php">Firmware</a></li>
                                 <!-- Categories with Products Dropdown -->
                                                                  <li class="menu-dropdown">
                                    <a href="https://getwayrom.com/shop.php?cat=1">
                                       Mothobord <i class="ion-ios-arrow-down"></i>
                                    </a>
                                    <ul class="sub-menu">
                                                                              <li class="menu-dropdown position-static">
                                          <a href="https://getwayrom.com/product-list.php?cat=1&subcat=9">
                                             test                                          </a>
                                       </li>
                                                                           </ul>
                                 </li>
                                                                  <li class="menu-dropdown">
                                    <a href="https://getwayrom.com/shop.php?cat=2">
                                       Mobile Accesories <i class="ion-ios-arrow-down"></i>
                                    </a>
                                    <ul class="sub-menu">
                                                                              <li><a href="#">No products available</a></li>
                                                                           </ul>
                                 </li>
                                                                  <li class="menu-dropdown">
                                    <a href="https://getwayrom.com/shop.php?cat=13">
                                       Tool Rent <i class="ion-ios-arrow-down"></i>
                                    </a>
                                    <ul class="sub-menu">
                                                                              <li><a href="#">No products available</a></li>
                                                                           </ul>
                                 </li>
                                                                  <!-- Activation Dropdown -->
                                 <li class="menu-dropdown">
                                    <a href="#">Activation <i class="ion-ios-arrow-down"></i></a>
                                    <!--<a href="shop.php?main=6">Activation <i class="ion-ios-arrow-down"></i></a>-->
                                   
                                 
<ul class="sub-menu">
        <li class="menu-dropdown position-static">
        <a href="https://getwayrom.com/pricing_plan.php">Package Plan</a>
    </li>

</ul>



                                 </li>
                                 <!-- Place Order Dropdown -->
                                 <li class="menu-dropdown">
                                    <a href="#">Place Order <i class="ion-ios-arrow-down"></i></a>
                                        <!--  <ul class="sub-menu">
                                       <li class="menu-dropdown position-static">
                                          <a href="imei_service.php">IMEI Service</a>
                                       </li> 
                                    </ul>-->
                                 </li>
                                 <!-- Other Menu Items -->
                                 <li><a href="https://getwayrom.com/share-link.php">Share Link</a></li>
                                 <li>
                                    <a href="https://getwayrom.com/pricing_plan_new.php">
                                    Buy Plan
                                    </a>
                                 </li>
                                 <li>
                                    <a href="https://getwayrom.com/resellers.php">
                                    Reseller
                                    </a>
                                 </li>
                              </ul>
                           </div>
                           <!-- Mobile Menu Toggle Button -->
                           <div class="mobile-menu-toggle-wrapper d-lg-none">
                              <button type="button" class="mobile-menu-toggle-btn" id="mobile-menu-toggle-btn" aria-label="Toggle Menu">
                                 <i class="bi bi-list"></i>
                                 <span>Main Menu</span>
                              </button>
                           </div>
                           
                           <!-- Mobile Menu -->
                           <div class="mobile-menu-area d-lg-none" id="mobile-menu-container">
                              <div class="mobile-menu">
                                 <nav id="mobile-menu-active">
                                    <ul class="menu-overflow">
                                       <li><a href="https://getwayrom.com/"><b>Home</b></a></li>
                                       <li><a href="firmware.php"><b>Firmware</b></a></li>
                                       <!-- Categories with Products Dropdown -->
                                                                              <li>
                                          <a href="https://getwayrom.com/shop.php?cat=1">
                                             <b>Mothobord</b>
                                          </a>
                                          <ul>
                                                                                          <li>
                                                <a href="https://getwayrom.com/product-list.php?cat=1&subcat=9">
                                                   test                                                </a>
                                             </li>
                                                                                       </ul>
                                       </li>
                                                                              <li>
                                          <a href="https://getwayrom.com/shop.php?cat=2">
                                             <b>Mobile Accesories</b>
                                          </a>
                                          <ul>
                                                                                          <li><a href="https://getwayrom.com/shop.php?cat=2">View All</a></li>
                                                                                       </ul>
                                       </li>
                                                                              <li>
                                          <a href="https://getwayrom.com/shop.php?cat=13">
                                             <b>Tool Rent</b>
                                          </a>
                                          <ul>
                                                                                          <li><a href="https://getwayrom.com/shop.php?cat=13">View All</a></li>
                                                                                       </ul>
                                       </li>
                                                                              <!-- Activation Dropdown -->
                                       <li>
                                          <a href="shop.php?main=6"><b>Activation</b></a>
                                          <ul>
                                                                                          <li>
                                                <a href="https://getwayrom.com/pricing_plan.php">Package Plan</a>
                                             </li>
                                          </ul>
                                       </li>
                                       <!-- Place Order Dropdown -->
                                       <li>
                                          <a href="#"><b>Place Order</b></a>
                                         <!--   <ul>
                                             <li><a href="imei_service.php">IMEI Service</a></li>
                                          </ul> -->
                                       </li>
                                       <!-- Static Menu Items -->
                                       <li><a href="https://getwayrom.com/share-link.php"><b>Share Link</b></a></li>
                                       <li><a href="https://getwayrom.com/pricing_plan.php"><b>Buy Plan</b></a></li>
                                       <li><a href="recent-files.php"><b>Recent Files</b></a></li>
                                    </ul>
                                 </nav>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>
         <!-- Marquee News Banner -->
         <div class="marquee-set" style="background:#a0b93a;">
            <div class="marquee-content">
               <div class="mq-file-item inline">
                  <a href="#" class="badge-color">
                  <b>We are bringing a new file for Huawei which is priced higher on other websites.</b>
                  </a>
                  <span class="item_date item_detail"></span>
               </div>
               <div class="mq-file-item inline">
                  <a href="#" class="badge-color">
                  <b>We are bringing a new file for Huawei which is priced higher on other websites.</b>
                  </a>
                  <span class="item_date item_detail"></span>
               </div>
            </div>
         </div>
         <style>
            /* Add these CSS rules to ensure black text */
            .marquee-set .badge-color,
            .marquee-set .badge-color b {
            color: #000000 !important;
            text-decoration: none;
            }
            .marquee-set .badge-color:hover {
            color: #000000 !important;
            text-decoration: none;
            }
            .marquee-set .item_date.item_detail {
            color: #000000;
            }
            /* Optional: Make text more visible with text shadow */
            .marquee-set .badge-color b {
            text-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
            }
            
            /* Mobile Menu Improvements - Only for mobile devices */
            @media only screen and (max-width: 991px) {
                /* Mobile Menu Toggle Button Wrapper - Green Bar */
                .mobile-menu-toggle-wrapper {
                    display: block !important;
                    width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: #a0b93a !important;
                    border-bottom: 2px solid #8fa030 !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-top: none !important;
                    position: relative !important;
                    box-sizing: border-box !important;
                    overflow: hidden !important;
                }
                
                /* Remove any container padding that might cause side borders */
                .mobile-menu-toggle-wrapper .container,
                .mobile-menu-toggle-wrapper .row,
                .mobile-menu-toggle-wrapper [class*="col-"] {
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                }
                
                .mobile-menu-toggle-btn {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    width: auto !important;
                    min-width: 120px !important;
                    padding: 12px 20px !important;
                    margin: 0 !important;
                    margin-left: auto !important;
                    background: #a0b93a !important;
                    color: #fff !important;
                    border: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-top: none !important;
                    border-bottom: none !important;
                    border-radius: 0 !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    box-shadow: none !important;
                    outline: none !important;
                }
                
                .mobile-menu-toggle-btn:hover {
                    background: #8fa030 !important;
                }
                
                .mobile-menu-toggle-btn:active {
                    background: #7a8a28 !important;
                }
                
                .mobile-menu-toggle-btn i {
                    font-size: 20px !important;
                }
                
                .mobile-menu-toggle-btn span {
                    font-weight: 600 !important;
                }
                
                /* Mobile Menu Area - Hidden by default, positioned below button */
                .mobile-menu-area {
                    background: #fff !important;
                    border-top: 1px solid #e0e0e0 !important;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: none !important;
                    max-height: 0 !important;
                    overflow: hidden !important;
                    transition: max-height 0.3s ease, display 0.3s ease !important;
                    position: relative !important;
                    z-index: 999 !important;
                }
                
                /* Mobile Menu Area - When active/open */
                .mobile-menu-area.menu-open {
                    display: block !important;
                    max-height: 2000px !important;
                }
                
                /* Mobile Menu Container */
                .mobile-menu {
                    padding: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                }
                
                /* Mobile Menu Navigation */
                #mobile-menu-active {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }
                
                /* Mobile Menu List */
                #mobile-menu-active .menu-overflow {
                    list-style: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }
                
                /* Mobile Menu Items */
                #mobile-menu-active .menu-overflow > li {
                    border-bottom: 1px solid #f0f0f0 !important;
                    margin: 0 !important;
                    width: 100% !important;
                    display: block !important;
                }
                
                #mobile-menu-active .menu-overflow > li:last-child {
                    border-bottom: none !important;
                }
                
                /* Mobile Menu Links */
                #mobile-menu-active .menu-overflow > li > a {
                    display: block !important;
                    padding: 15px 20px !important;
                    color: #333 !important;
                    text-decoration: none !important;
                    font-size: 15px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                    background: #fff !important;
                    position: relative !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    border: none !important;
                }
                
                #mobile-menu-active .menu-overflow > li > a:hover,
                #mobile-menu-active .menu-overflow > li > a:focus {
                    background: #f8f9fa !important;
                    color: #a0b93a !important;
                    padding-left: 25px !important;
                }
                
                #mobile-menu-active .menu-overflow > li > a b {
                    font-weight: 600 !important;
                }
                
                /* Mobile Menu Submenu */
                #mobile-menu-active .menu-overflow > li > ul {
                    list-style: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #f8f9fa !important;
                    display: none !important;
                    width: 100% !important;
                }
                
                #mobile-menu-active .menu-overflow > li.active > ul,
                #mobile-menu-active .menu-overflow > li.open > ul {
                    display: block !important;
                }
                
                /* Mobile Submenu Items */
                #mobile-menu-active .menu-overflow > li > ul > li {
                    border-bottom: 1px solid #e9ecef !important;
                    width: 100% !important;
                    display: block !important;
                }
                
                #mobile-menu-active .menu-overflow > li > ul > li:last-child {
                    border-bottom: none !important;
                }
                
                /* Mobile Submenu Links */
                #mobile-menu-active .menu-overflow > li > ul > li > a {
                    display: block !important;
                    padding: 12px 20px 12px 40px !important;
                    color: #666 !important;
                    text-decoration: none !important;
                    font-size: 14px !important;
                    transition: all 0.3s ease !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    border: none !important;
                }
                
                #mobile-menu-active .menu-overflow > li > ul > li > a:hover {
                    background: #e9ecef !important;
                    color: #a0b93a !important;
                    padding-left: 45px !important;
                }
                
                /* Mobile Menu Toggle Arrow */
                #mobile-menu-active .menu-overflow > li.has-submenu > a::after {
                    content: '\f282' !important;
                    font-family: 'bootstrap-icons' !important;
                    font-weight: normal !important;
                    float: right !important;
                    transition: transform 0.3s ease !important;
                    font-size: 14px !important;
                }
                
                #mobile-menu-active .menu-overflow > li.has-submenu.active > a::after,
                #mobile-menu-active .menu-overflow > li.has-submenu.open > a::after {
                    transform: rotate(180deg) !important;
                }
                
                /* Mobile Search Area */
                .mobileViewSearchArea {
                    background: #f8f9fa !important;
                    padding: 15px !important;
                    border-bottom: 1px solid #e0e0e0 !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .mobileViewSearchAreainner {
                    display: flex !important;
                    gap: 10px !important;
                    align-items: center !important;
                    width: 100% !important;
                }
                
                .mobileViewSearchAreainner .searchInput {
                    flex: 1 !important;
                    border: 1px solid #ddd !important;
                    border-radius: 5px !important;
                    padding: 10px 15px !important;
                    font-size: 14px !important;
                    min-width: 0 !important;
                }
                
                .mobileViewSearchAreainner .searchBtn {
                    background: #a0b93a !important;
                    color: #fff !important;
                    border: none !important;
                    border-radius: 5px !important;
                    padding: 10px 20px !important;
                    cursor: pointer !important;
                    transition: background 0.3s ease !important;
                    flex-shrink: 0 !important;
                }
                
                .mobileViewSearchAreainner .searchBtn:hover {
                    background: #8fa030 !important;
                }
                
                /* Navigation Area Mobile */
                .navigation_area {
                    background: #fff !important;
                }
                
                /* Header Mobile Adjustments */
                header {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
                }
            }
         </style>
         <!-- Recent Files Section -->
         <div style="background-color:#182a3e; padding:12px 0 5px 0;">
            <div class="container">
               <div class="row">
                  <div class="col-md-2 col-sm-12" style="padding-top:8px;">
                     <span style="color:#FFF;"><i class="fa-regular fa-clock"></i> <b>Recent Files</b></span>
                  </div>
                  <div class="col-md-10 col-sm-12">
                        <marquee>
                                                                    <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28475" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           P673L-XE67FABJKLMNOPQRSTUVWXY-U-OP-260108V1550.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28474" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           KJ5-H6931ABCDEFGHI-T-OP-250908V2083.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28467" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           PD2280F_EX_A_15.2.14.0.W30.V000L1_vivo_osc_ZK_20240716190000_qcom_LA.QSSI.15.0.r1-00900-qssi.0-1_system_split.tar.gz                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28466" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           CPH2773export_11_14.0.1.1800EX01_2025052223000207.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28465" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           CPH2847export_11_15.0.2.901EX01_2025120923160000.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28464" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           CPH2373export_11_F.73_2024110419010000_TESTED.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28463" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           CPH2527_11.F.68_2680_202508061440.7z                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28457" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           A6610L-SQ372ABCDEFGHIJKLMNOPQRSTVWXZ-UGo-OP-260114V1904                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28456" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           A6610L-SQ372FGI-UGo-IN-260113V129                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28455" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           X6815-H771A-R-INFK-220123V114                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28454" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           Realme_GT_5_RMX3823_Domestic_11_13.1.1.142CN01_230913_QFIL.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28453" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           RMX3800domestic_11_15.0.0.710CN01_2025042517220167                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28452" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                            RMX3842export_11_15.0.0.600EX01_2025022610340159.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28451" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           RMX3843domestic_11_15.0.0.400CN01_20250117005.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28450" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                            RMX3868export_11_14.0.0.516EX01_2024120322160170.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28445" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           VIVO Y69 PD1705F Unlock After Auto Reboot Auto Port Hang ON Logo Fix 100% Tested ALL ERROR FIX                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28444" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           Samsung SM-A045F_A045FXXSDEZA1_BIT-14_KNOX_OFF_ROM.rar                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28443" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           Samsung SM-A045F_A045FXXSEEZB1_BIT-15_KNOX_OFF_ROM.rar                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28442" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           Samsung SM-M556B_M556BXXS4BYH2_Bit-4_KNOX_OFF_ROM.rar                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28441" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           P703-M6953AB-GO-210510V56.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28440" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           N8S-H356B1-M-KESF-170214V50.zip                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28439" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           Tecno N5S QL610-L-KE-SAFARICOM-20151018 multiDownload                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28438" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           N2-D2030B1-M-TZTG-170307V6.rar                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28437" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           T1201-MX760AB-V-RU-251023V1270 [RU-MARKET]                                        </a>
                                                                       <a class="btn btn-primary content-btn" 
                                           href="firmwares.php?firm=28436" 
                                           style="background-color: #1D970D; border-color: #1D970D; color: #FFF;">
                                           LE8-H771B-R-GL-220902V1114.zip                                        </a>
                                                       </marquee>
                  </div>
               </div>
            </div>
         </div>
         <!-- Login Modal -->
         <div class="modal signin_modal" id="signinModal">
            <div class="modal-dialog signin_modal_dialog">
               <div class="modal-content signin_modal_content">
                  <div class="modal-header signin_modal_header">
                     <h4 class="modal-title signin_modal_title">Login</h4>
                     <button type="button" class="close" data-dismiss="modal">&times;</button>
                  </div>
                  <form name="form1" method="post" action="" autocomplete="off">
                     <input type="hidden" name="csrf_token" value="e43699de4566936ac2c3a020272f51dec97e148edda21c797d4fbd04ac1d1f68">
                     <div class="modal-body signin_modal_body">
                                                                        <div class="form-group">
                           <label>Email or Phone</label>
                           <input type="text" name="email" placeholder="Email or Phone Number (10 digit)" class="form-control" required>
                        </div>
                        <div class="form-group">
                           <label>Password</label>
                           <input type="password" name="password" placeholder="Password" class="form-control" required>
                        </div>
                        <input type="hidden" name="firmware" value="">
                        <div class="login-toggle-btn">
                           <input type="checkbox" />
                           <a class="flote-none" href="javascript:void(0)">Remember me</a>
                           <a href="forgot.php">Forgot Password?</a>
                        </div>
                        <div class="signin_modal_btn_area">
                           <button type="submit" name="signin" class="signin_modal_btn">Login</button>
                        </div>
                        <div class="sign_up_content">
                           Not a member? <a href="https://getwayrom.com/login.php">Sign Up Now</a>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <!-- Search Include -->
         
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Component</title>
    <style>
        .search_container {
            width: 100%;
            background: linear-gradient(145deg, #ff8c00, #ff6b00); /* Orange gradient background */
            padding: 12px 0;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            position: relative;
            
        }

        .header_account_list.search_list {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 15px;
            position: relative;
        }

        .mobile_search {
            display: none;
        }

        .desktop_search {
            width: 100%;
        }

        .top_search {
            width: 100%;
        }

        .top_searchinner {
            position: relative;
            display: flex;
            align-items: center;
            background: #fff;
            border-radius: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }

        .top_searchinner:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            transform: translateY(-1px);
        }

        .top_searchinner input {
            width: 100%;
            height: 38px;
            padding: 0 50px 0 20px;
            border: none;
            background: transparent;
            font-size: 14px;
            color: #333;
            border-radius: 30px;
        }

        .top_searchinner input:focus {
            outline: none;
        }

        .top_searchinner input::placeholder {
            color: #999;
            opacity: 0.8;
        }

        .search_button {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: #333;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .search_button:hover {
            background: #222;
            transform: translateY(-50%) scale(1.05);
        }

        .search_button i {
            font-size: 16px;
            color: #fff;
        }

        /* Media Queries */
        @media screen and (max-width: 991px) {
            .mobile_search {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 35px;
                height: 35px;
                background: #333;
                border-radius: 50%;
                margin-left: auto;
            }

            .mobile_search i {
                font-size: 18px;
                color: #fff;
            }

            .desktop_search {
                position: absolute;
                top: 100%;
                right: 0;
                width: 280px;
                background: #fff;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                display: none;
                animation: searchAppear 0.3s ease;
            }

            .search_list:hover .desktop_search {
                display: block;
            }
        }

        @media screen and (max-width: 768px) {
            .top_searchinner input {
                height: 35px;
                font-size: 13px;
            }

            .search_button {
                width: 28px;
                height: 28px;
            }

            .search_button i {
                font-size: 14px;
            }
        }

        @media screen and (max-width: 576px) {
            .desktop_search {
                width: 240px;
                right: -10px;
                padding: 12px;
            }

            .top_searchinner input {
                height: 32px;
                font-size: 12px;
                padding: 0 40px 0 15px;
            }

            .mobile_search {
                width: 32px;
                height: 32px;
            }

            .mobile_search i {
                font-size: 16px;
            }

            .search_button {
                width: 26px;
                height: 26px;
                right: 3px;
            }
        }

        /* Hover and Focus Effects */
        .top_searchinner input:focus {
            background: rgba(255,255,255,0.95);
        }

        .mobile_search:hover {
            background: #222;
            transform: scale(1.05);
        }

        /* Smooth transitions */
        .top_searchinner, 
        .search_button, 
        .mobile_search {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="search_container">
        <div class="header_account_list search_list"> 
            <a href="javascript:void(0)" class="mobile_search">
                <i class="ion-ios-search-strong"></i>
            </a>
            <div class="desktop_search">
                <div class="top_search">
                    <form method="post" action=""> <!-- Action can be left empty to post to the same page -->
                        <div class="top_searchinner">
                            <input name="keyword" placeholder="Search for ..." value="" type="text" />                  
                            <button type="submit" name="enter" class="search_button">
                                <i class="ion-ios-search-strong"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>      </div>
      <!-- End #main -->
      <!-- Scripts -->
      <script src="assets/js/vendor/jquery-3.5.1.min.js"></script>
      <script src="assets/js/vendor/modernizr-3.7.1.min.js"></script>
      <!--<script src="assets/js/plugins.min.js"></script>-->
      <script src="assets/js/main.js"></script>
      
      <!-- COMPREHENSIVE ERROR SUPPRESSION SYSTEM -->
      <script>
      (function() {
          'use strict';
          
          // Complete list of problematic resources and error patterns
          const problematicPatterns = [
              'wap/upload/products/',
              'upload/slider/',
              'notification.mp3',
              'livetrafficfeed.com',
              'google-analytics.com',
              'googlesyndication.com',
              'get-cart-count.php',
              'check-notifications.php',
              '404',
              'net::err_blocked_by_client',
              'failed to fetch',
              'unexpected token',
              'script error',
              'non-error promise rejection'
          ];
          
          // 1. Override ALL console methods
          const originalConsoleError = console.error;
          const originalConsoleWarn = console.warn;
          const originalConsoleLog = console.log;
          
          console.error = function(...args) {
              const message = args.join(' ').toLowerCase();
              if (!problematicPatterns.some(pattern => message.includes(pattern))) {
                  originalConsoleError.apply(console, args);
              }
          };
          
          console.warn = function(...args) {
              const message = args.join(' ').toLowerCase();
              if (!message.includes('preloaded using link preload') && 
                  !message.includes('noto+sans+devanagari') &&
                  !problematicPatterns.some(pattern => message.includes(pattern))) {
                  originalConsoleWarn.apply(console, args);
              }
          };
          
          // 2. Suppress ALL window errors
          window.addEventListener('error', function(e) {
              const message = (e.message || '').toLowerCase();
              const filename = (e.filename || '').toLowerCase();
              
              if (problematicPatterns.some(pattern => 
                  message.includes(pattern) || filename.includes(pattern))) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
              }
          }, true);
          
          // 3. Suppress ALL promise rejections
          window.addEventListener('unhandledrejection', function(e) {
              const reason = String(e.reason || '').toLowerCase();
              if (problematicPatterns.some(pattern => reason.includes(pattern))) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
              }
          }, true);
          
          // 4. Override fetch to handle ALL failures gracefully
          const originalFetch = window.fetch;
          window.fetch = function(...args) {
              return originalFetch.apply(this, args).catch(error => {
                  const url = args[0] ? args[0].toString().toLowerCase() : '';
                  
                  // Return mock success response for problematic URLs
                  if (problematicPatterns.some(pattern => url.includes(pattern))) {
                      return new Response(JSON.stringify({
                          status: 'disabled',
                          count: 0,
                          total: 0,
                          hasNewNotifications: false,
                          notifications: []
                      }), {
                          status: 200,
                          headers: {'Content-Type': 'application/json'}
                      });
                  }
                  
                  throw error;
              });
          };
          
          // 5. Override XMLHttpRequest for older AJAX calls
          const originalXHROpen = XMLHttpRequest.prototype.open;
          const originalXHRSend = XMLHttpRequest.prototype.send;
          
          XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
              this._url = url;
              return originalXHROpen.apply(this, arguments);
          };
          
          XMLHttpRequest.prototype.send = function(data) {
              const url = this._url || '';
              
              if (problematicPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
                  // Mock successful response
                  Object.defineProperty(this, 'status', { value: 200, writable: false });
                  Object.defineProperty(this, 'readyState', { value: 4, writable: false });
                  Object.defineProperty(this, 'responseText', { 
                      value: '{"status":"disabled","count":0}', 
                      writable: false 
                  });
                  
                  setTimeout(() => {
                      if (this.onreadystatechange) this.onreadystatechange();
                      if (this.onload) this.onload();
                  }, 1);
                  return;
              }
              
              return originalXHRSend.apply(this, arguments);
          };
          
          // 6. Handle DOM ready events
          document.addEventListener('DOMContentLoaded', function() {
              // Remove broken images
              document.querySelectorAll('img').forEach(function(img) {
                  img.addEventListener('error', function() {
                      if (!this.dataset.errorHandled) {
                          this.dataset.errorHandled = 'true';
                          this.style.opacity = '0';
                          this.style.position = 'absolute';
                          this.style.left = '-9999px';
                      }
                  });
              });
              
              // Remove problematic audio elements
              document.querySelectorAll('audio').forEach(function(audio) {
                  audio.remove();
              });
              
              // Remove problematic scripts
              document.querySelectorAll('script[src*="livetrafficfeed"], script[src*="adsbygoogle"]').forEach(function(script) {
                  script.remove();
              });
          });
          
          // 7. Disable problematic functions completely
          window.updateCart = function() { 
              console.log('Cart update system disabled to prevent errors'); 
          };
          
          window.checkForNewTransactions = function() { 
              console.log('Transaction checking disabled to prevent errors'); 
          };
          
          window.checkForNewNotifications = function() { 
              console.log('Notification checking disabled to prevent errors'); 
          };
          
          // 8. Override any existing interval/timeout functions that might cause issues
          const originalSetInterval = window.setInterval;
          const originalSetTimeout = window.setTimeout;
          
          window.setInterval = function(callback, delay) {
              try {
                  const callbackString = callback.toString().toLowerCase();
                  if (problematicPatterns.some(pattern => callbackString.includes(pattern))) {
                      return 0; // Return dummy interval ID
                  }
              } catch (e) {
                  // If we can't check the callback, allow it
              }
              return originalSetInterval.apply(this, arguments);
          };
          
      })();
      
      // Initialize safe functionality
      document.addEventListener('DOMContentLoaded', function() {
          // Initialize tooltips if available
          if(typeof $ !== 'undefined' && typeof $.fn.tooltip !== 'undefined') {
              $('[data-toggle="tooltip"]').tooltip();
          }
      
          // Mobile Menu Toggle - jQuery version (primary)
          if (typeof jQuery !== 'undefined') {
              jQuery(document).ready(function($) {
                  // Handle toggle button
                  $('#mobile-menu-toggle-btn').on('click', function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $('#mobile-menu-container').toggleClass('menu-open');
                      
                      // Update icon
                      var $icon = $(this).find('i');
                      if ($('#mobile-menu-container').hasClass('menu-open')) {
                          $icon.removeClass('bi-list').addClass('bi-x-lg');
                      } else {
                          $icon.removeClass('bi-x-lg').addClass('bi-list');
                      }
                  });
                  
                  // Close menu when clicking outside
                  $(document).on('click', function(e) {
                      if ($('#mobile-menu-container').hasClass('menu-open')) {
                          if (!$(e.target).closest('#mobile-menu-container, #mobile-menu-toggle-btn').length) {
                              $('#mobile-menu-container').removeClass('menu-open');
                              $('#mobile-menu-toggle-btn i').removeClass('bi-x-lg').addClass('bi-list');
                          }
                      }
                  });
                  
          // Mobile Menu Toggle Functionality for Submenus
                  // Add has-submenu class to items with submenus
                  $('#mobile-menu-active .menu-overflow > li').each(function() {
                      if ($(this).find('> ul').length > 0) {
                          $(this).addClass('has-submenu');
                      }
                  });
                  
                  // Handle menu item clicks for mobile
                  $(document).on('click', '#mobile-menu-active .menu-overflow > li > a', function(e) {
                      var $parent = $(this).parent('li');
                      var $submenu = $parent.find('> ul');
                      
                      // If there's a submenu
                      if ($submenu.length > 0) {
                          e.preventDefault();
                          
                          // Close other open menus
                          $('#mobile-menu-active .menu-overflow > li').not($parent).removeClass('active open').find('> ul').slideUp(300);
                          
                          // Toggle current menu
                          $parent.toggleClass('active open');
                          $submenu.slideToggle(300);
                      }
                  });
              });
          } else {
              // Fallback vanilla JavaScript version
              // Handle toggle button
              const mobileMenuToggleBtnFallback = document.getElementById('mobile-menu-toggle-btn');
              const mobileMenuContainerFallback = document.getElementById('mobile-menu-container');
              
              if(mobileMenuToggleBtnFallback && mobileMenuContainerFallback) {
                  mobileMenuToggleBtnFallback.addEventListener('click', function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      mobileMenuContainerFallback.classList.toggle('menu-open');
                      
                      const icon = this.querySelector('i');
                      if (icon) {
                          if (mobileMenuContainerFallback.classList.contains('menu-open')) {
                              icon.className = 'bi bi-x-lg';
                          } else {
                              icon.className = 'bi bi-list';
                          }
                      }
                  });
                  
                  // Close menu when clicking outside
                  document.addEventListener('click', function(e) {
                      if (mobileMenuContainerFallback && mobileMenuContainerFallback.classList.contains('menu-open')) {
                          if (!mobileMenuContainerFallback.contains(e.target) && !mobileMenuToggleBtnFallback.contains(e.target)) {
                              mobileMenuContainerFallback.classList.remove('menu-open');
                              const icon = mobileMenuToggleBtnFallback.querySelector('i');
                              if (icon) {
                                  icon.className = 'bi bi-list';
                              }
                          }
                      }
                  });
              }
              
              setTimeout(function() {
                  const mobileMenuItems = document.querySelectorAll('#mobile-menu-active .menu-overflow > li');
                  mobileMenuItems.forEach(function(item) {
                      const submenu = item.querySelector('> ul');
                      if (submenu) {
                          item.classList.add('has-submenu');
                      }
                  });
                  
                  // Handle menu item clicks for mobile
                  document.addEventListener('click', function(e) {
                      let target = e.target;
                      while (target && target !== document) {
                          if (target.matches && target.matches('#mobile-menu-active .menu-overflow > li > a')) {
                              const parentLi = target.parentElement;
                              const submenu = parentLi.querySelector('> ul');
                              
                              if (submenu) {
                                  e.preventDefault();
                                  
                                  // Close other open menus
                                  mobileMenuItems.forEach(function(item) {
                                      if (item !== parentLi) {
                                          item.classList.remove('active', 'open');
                                          const otherSubmenu = item.querySelector('> ul');
                                          if (otherSubmenu) {
                                              otherSubmenu.style.display = 'none';
                                          }
                                      }
                                  });
                                  
                                  // Toggle current menu
                                  parentLi.classList.toggle('active');
                                  parentLi.classList.toggle('open');
                                  
                                  if (submenu.style.display === 'block') {
                                      submenu.style.display = 'none';
                                  } else {
                                      submenu.style.display = 'block';
                                  }
                              }
                              break;
                          }
                          target = target.parentElement;
                      }
                  });
              }, 100);
          }
      
          // Handle Dropdowns
          const dropdowns = document.querySelectorAll('.menu-dropdown');
          dropdowns.forEach(function(dropdown) {
              const subMenu = dropdown.querySelector('.sub-menu');
              if(subMenu) {
                  dropdown.addEventListener('mouseenter', function() {
                      subMenu.style.display = 'block';
                  });
                  dropdown.addEventListener('mouseleave', function() {
                      subMenu.style.display = 'none';
                  });
              }
          });
      
          // Safe form validation
          const loginForm = document.querySelector('form[name="form1"]');
          if(loginForm) {
              loginForm.addEventListener('submit', function(e) {
                  const email = this.querySelector('input[name="email"]');
                  const password = this.querySelector('input[name="password"]');
                  
                  if(!email || !email.value || !password || !password.value) {
                      e.preventDefault();
                      alert('Please fill in all required fields');
                  }
              });
          }
      
          // Sticky Navigation
          const header = document.querySelector('.navigation_area');
          if(header) {
              let ticking = false;
              const sticky = header.offsetTop;
              
              function updateNav() {
                  if (window.pageYOffset > sticky) {
                      header.classList.add("sticky");
                  } else {
                      header.classList.remove("sticky");
                  }
                  ticking = false;
              }
              
              window.addEventListener('scroll', function() {
                  if (!ticking) {
                      requestAnimationFrame(updateNav);
                      ticking = true;
                  }
              });
          }
      });
      
      // Tab Notification Manager - Safe version
      class TabNotificationManager {
          constructor() {
              this.originalTitle = document.title;
              this.interval = null;
              this.isFlashing = false;
          }
      
          startFlashing(message, flashInterval = 1000) {
              if (this.isFlashing) return;
              
              this.isFlashing = true;
              let isOriginal = true;
              
              this.interval = setInterval(() => {
                  document.title = isOriginal ? `🔔 ${message}` : this.originalTitle;
                  isOriginal = !isOriginal;
              }, flashInterval);
      
              // Stop flashing when tab gets focus
              const stopFlashing = () => this.stopFlashing();
              window.addEventListener('focus', stopFlashing, { once: true });
          }
      
          stopFlashing() {
              if (!this.isFlashing) return;
              
              if (this.interval) {
                  clearInterval(this.interval);
                  this.interval = null;
              }
              document.title = this.originalTitle;
              this.isFlashing = false;
          }
      }
      
      // Initialize notification manager
      const tabNotification = new TabNotificationManager();
      
      // Handle PHP flash messages
            
      // Safe custom alert function
      function showCustomAlert() {
          const message = "Get-25 Files Just For RS-350/- Premium Files Only- Buy Now";
          
          const alertDiv = document.createElement('div');
          alertDiv.style.cssText = `
              position: fixed;
              top: 150px;
              left: 50%;
              transform: translateX(-50%);
              background: #000000;
              color: #ffff00;
              padding: 20px 40px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              transition: top 0.5s ease;
              z-index: 1000;
              font-weight: bold;
              font-size: 24px;
              min-width: 500px;
              text-align: center;
              font-family: Arial, sans-serif;
              cursor: pointer;
          `;
          
          alertDiv.textContent = message;
          
          alertDiv.addEventListener('mouseover', function() {
              this.style.backgroundColor = '#1f3754';
          });
          
          alertDiv.addEventListener('mouseout', function() {
              this.style.backgroundColor = '#000000';
          });
          
          alertDiv.addEventListener('click', function() {
              this.style.top = '-100px';
              setTimeout(() => {
                  if (this.parentNode) {
                      this.parentNode.removeChild(this);
                  }
              }, 500);
          });
          
          document.body.appendChild(alertDiv);
          
          // Animate dropdown
          setTimeout(() => {
              alertDiv.style.top = '20px';
          }, 100);
          
          // Auto remove after delay
          setTimeout(() => {
              if (alertDiv.parentNode) {
                  alertDiv.style.top = '-100px';
                  setTimeout(() => {
                      if (alertDiv.parentNode) {
                          document.body.removeChild(alertDiv);
                      }
                  }, 800);
              }
          }, 8000);
      }
      
      // Start alert sequence safely
      setTimeout(() => {
          try {
              showCustomAlert();
              setInterval(showCustomAlert, 30000);
          } catch (e) {
              console.log('Alert system disabled');
          }
      }, 3000);
      
      </script>
   </body>
</html>
    
    <!-- Breadcrumb Area start -->
    <section class="breadcrumb-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="breadcrumb-content">
                        <h1 class="breadcrumb-hrading">Login / Register</h1>
                        <ul class="breadcrumb-links">
                            <li><a href="index.php">Home</a></li>
                            <li>Login / Register</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Area End -->
    <!-- login area start -->
    <div class="login-register-area mb-60px mt-53px">
        <div class="container">
            <div class="row">
                <div class="col-lg-7 col-md-12 ml-auto mr-auto">
                    <div class="login-register-wrapper">
                        <div class="login-register-tab-list nav">
                            <a class="active" data-toggle="tab" href="#lg1">
                                <h4>login</h4>
                            </a>
                            <a class="" data-toggle="tab" href="#lg2">
                                <h4>register</h4>
                            </a>
                        </div>
                        <div class="tab-content">
                        
                                                
                                                
                                                
                                                
                                                
                                                
                                                
                                                
                                                
                                                
                            <div id="lg1" class="tab-pane active">
                                <div class="login-form-container">
                                    <div class="login-register-form">
                                        <form name="form1" action="" method="post">
                                            <input type="text" name="email" placeholder="Email or Phone Number (10 digit)" required />
                                            <input type="password" name="password" placeholder="Password" required />
                                            <!-- Added hidden input field to store HTTP referer -->
                                            <input type="hidden" name="referer" value="">
                                            <div class="button-box">
                                                <div class="login-toggle-btn">
                                                    <input type="checkbox" name="remember" checked />
                                                    <a class="flote-none" href="javascript:void(0)">Remember me</a>
                                                    <a href="forgot.php">Forgot Password?</a>
                                                </div>
                                                <button name="signin" type="submit"><span>Login</span></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div id="lg2" class="tab-pane ">
                                <div class="login-form-container">
                                    <div class="login-register-form">
                                        <!-- Registration Form -->
                                        <div id="registration-form">
                                            <form name="form2" action="" method="post">
                                                <input type="text" name="fullname" placeholder="Full Name" required />
                                                
                                                <input type="email" name="email" placeholder="Email" required />
                                                
                                                <!-- Country phone code select (placed BEFORE phone number as requested) -->
                                                <div class="phone-field">
                                                    <select name="country_code" required aria-label="Country code">
                                                        <option value="">Select Code</option>
                                                       <option value="93">Afghanistan (+93)</option>
                                                       <option value="355">Albania (+355)</option>
                                                       <option value="213">Algeria (+213)</option>
                                                       <option value="1684">American Samoa (+1684)</option>
                                                       <option value="376">Andorra (+376)</option>
                                                       <option value="244">Angola (+244)</option>
                                                       <option value="1264">Anguilla (+1264)</option>
                                                       <option value="672">Antarctica (+672)</option>
                                                       <option value="1268">Antigua and Barbuda (+1268)</option>
                                                       <option value="54">Argentina (+54)</option>
                                                       <option value="374">Armenia (+374)</option>
                                                       <option value="297">Aruba (+297)</option>
                                                       <option value="61">Australia (+61)</option>
                                                       <option value="43">Austria (+43)</option>
                                                       <option value="994">Azerbaijan (+994)</option>
                                                       <option value="1242">Bahamas (+1242)</option>
                                                       <option value="973">Bahrain (+973)</option>
                                                       <option value="880">Bangladesh (+880)</option>
                                                       <option value="1246">Barbados (+1246)</option>
                                                       <option value="375">Belarus (+375)</option>
                                                       <option value="32">Belgium (+32)</option>
                                                       <option value="501">Belize (+501)</option>
                                                       <option value="229">Benin (+229)</option>
                                                       <option value="1441">Bermuda (+1441)</option>
                                                       <option value="975">Bhutan (+975)</option>
                                                       <option value="591">Bolivia (+591)</option>
                                                       <option value="387">Bosnia and Herzegovina (+387)</option>
                                                       <option value="267">Botswana (+267)</option>
                                                       <option value="55">Brazil (+55)</option>
                                                       <option value="246">British Indian Ocean Territory (+246)</option>
                                                       <option value="1284">British Virgin Islands (+1284)</option>
                                                       <option value="673">Brunei (+673)</option>
                                                       <option value="359">Bulgaria (+359)</option>
                                                       <option value="226">Burkina Faso (+226)</option>
                                                       <option value="257">Burundi (+257)</option>
                                                       <option value="855">Cambodia (+855)</option>
                                                       <option value="237">Cameroon (+237)</option>
                                                       <option value="1">Canada (+1)</option>
                                                       <option value="238">Cape Verde (+238)</option>
                                                       <option value="1345">Cayman Islands (+1345)</option>
                                                       <option value="236">Central African Republic (+236)</option>
                                                       <option value="235">Chad (+235)</option>
                                                       <option value="56">Chile (+56)</option>
                                                       <option value="86">China (+86)</option>
                                                       <option value="61">Christmas Island (+61)</option>
                                                       <option value="61">Cocos Islands (+61)</option>
                                                       <option value="57">Colombia (+57)</option>
                                                       <option value="269">Comoros (+269)</option>
                                                       <option value="682">Cook Islands (+682)</option>
                                                       <option value="506">Costa Rica (+506)</option>
                                                       <option value="385">Croatia (+385)</option>
                                                       <option value="53">Cuba (+53)</option>
                                                       <option value="599">Curacao (+599)</option>
                                                       <option value="357">Cyprus (+357)</option>
                                                       <option value="420">Czech Republic (+420)</option>
                                                       <option value="243">Democratic Republic of the Congo (+243)</option>
                                                       <option value="45">Denmark (+45)</option>
                                                       <option value="253">Djibouti (+253)</option>
                                                       <option value="1767">Dominica (+1767)</option>
                                                       <option value="1809">Dominican Republic (+1809)</option>
                                                       <option value="670">East Timor (+670)</option>
                                                       <option value="593">Ecuador (+593)</option>
                                                       <option value="20">Egypt (+20)</option>
                                                       <option value="503">El Salvador (+503)</option>
                                                       <option value="240">Equatorial Guinea (+240)</option>
                                                       <option value="291">Eritrea (+291)</option>
                                                       <option value="372">Estonia (+372)</option>
                                                       <option value="251">Ethiopia (+251)</option>
                                                       <option value="500">Falkland Islands (+500)</option>
                                                       <option value="298">Faroe Islands (+298)</option>
                                                       <option value="679">Fiji (+679)</option>
                                                       <option value="358">Finland (+358)</option>
                                                       <option value="33">France (+33)</option>
                                                       <option value="689">French Polynesia (+689)</option>
                                                       <option value="241">Gabon (+241)</option>
                                                       <option value="220">Gambia (+220)</option>
                                                       <option value="995">Georgia (+995)</option>
                                                       <option value="49">Germany (+49)</option>
                                                       <option value="233">Ghana (+233)</option>
                                                       <option value="350">Gibraltar (+350)</option>
                                                       <option value="30">Greece (+30)</option>
                                                       <option value="299">Greenland (+299)</option>
                                                       <option value="1473">Grenada (+1473)</option>
                                                       <option value="1671">Guam (+1671)</option>
                                                       <option value="502">Guatemala (+502)</option>
                                                       <option value="224">Guinea (+224)</option>
                                                       <option value="245">Guinea-Bissau (+245)</option>
                                                       <option value="592">Guyana (+592)</option>
                                                       <option value="509">Haiti (+509)</option>
                                                       <option value="504">Honduras (+504)</option>
                                                       <option value="852">Hong Kong (+852)</option>
                                                       <option value="36">Hungary (+36)</option>
                                                       <option value="354">Iceland (+354)</option>
                                                       <option value="91">India (+91)</option>
                                                       <option value="62">Indonesia (+62)</option>
                                                       <option value="98">Iran (+98)</option>
                                                       <option value="964">Iraq (+964)</option>
                                                       <option value="353">Ireland (+353)</option>
                                                       <option value="972">Israel (+972)</option>
                                                       <option value="39">Italy (+39)</option>
                                                       <option value="225">Ivory Coast (+225)</option>
                                                       <option value="1876">Jamaica (+1876)</option>
                                                       <option value="81">Japan (+81)</option>
                                                       <option value="962">Jordan (+962)</option>
                                                       <option value="7">Kazakhstan (+7)</option>
                                                       <option value="254">Kenya (+254)</option>
                                                       <option value="686">Kiribati (+686)</option>
                                                       <option value="383">Kosovo (+383)</option>
                                                       <option value="965">Kuwait (+965)</option>
                                                       <option value="996">Kyrgyzstan (+996)</option>
                                                       <option value="856">Laos (+856)</option>
                                                       <option value="371">Latvia (+371)</option>
                                                       <option value="961">Lebanon (+961)</option>
                                                       <option value="266">Lesotho (+266)</option>
                                                       <option value="231">Liberia (+231)</option>
                                                       <option value="218">Libya (+218)</option>
                                                       <option value="423">Liechtenstein (+423)</option>
                                                       <option value="370">Lithuania (+370)</option>
                                                       <option value="352">Luxembourg (+352)</option>
                                                       <option value="853">Macau (+853)</option>
                                                       <option value="389">North Macedonia (+389)</option>
                                                       <option value="261">Madagascar (+261)</option>
                                                       <option value="265">Malawi (+265)</option>
                                                       <option value="60">Malaysia (+60)</option>
                                                       <option value="960">Maldives (+960)</option>
                                                       <option value="223">Mali (+223)</option>
                                                       <option value="356">Malta (+356)</option>
                                                       <option value="692">Marshall Islands (+692)</option>
                                                       <option value="222">Mauritania (+222)</option>
                                                       <option value="230">Mauritius (+230)</option>
                                                       <option value="262">Mayotte (+262)</option>
                                                       <option value="52">Mexico (+52)</option>
                                                       <option value="691">Micronesia (+691)</option>
                                                       <option value="373">Moldova (+373)</option>
                                                       <option value="377">Monaco (+377)</option>
                                                       <option value="976">Mongolia (+976)</option>
                                                       <option value="382">Montenegro (+382)</option>
                                                       <option value="1664">Montserrat (+1664)</option>
                                                       <option value="212">Morocco (+212)</option>
                                                       <option value="258">Mozambique (+258)</option>
                                                       <option value="95">Myanmar (+95)</option>
                                                       <option value="264">Namibia (+264)</option>
                                                       <option value="674">Nauru (+674)</option>
                                                       <option value="977">Nepal (+977)</option>
                                                       <option value="31">Netherlands (+31)</option>
                                                       <option value="687">New Caledonia (+687)</option>
                                                       <option value="64">New Zealand (+64)</option>
                                                       <option value="505">Nicaragua (+505)</option>
                                                       <option value="227">Niger (+227)</option>
                                                       <option value="234">Nigeria (+234)</option>
                                                       <option value="683">Niue (+683)</option>
                                                       <option value="672">Norfolk Island (+672)</option>
                                                       <option value="850">North Korea (+850)</option>
                                                       <option value="47">Norway (+47)</option>
                                                       <option value="968">Oman (+968)</option>
                                                       <option value="92">Pakistan (+92)</option>
                                                       <option value="680">Palau (+680)</option>
                                                       <option value="970">Palestine (+970)</option>
                                                       <option value="507">Panama (+507)</option>
                                                       <option value="675">Papua New Guinea (+675)</option>
                                                       <option value="595">Paraguay (+595)</option>
                                                       <option value="51">Peru (+51)</option>
                                                       <option value="63">Philippines (+63)</option>
                                                       <option value="48">Poland (+48)</option>
                                                       <option value="351">Portugal (+351)</option>
                                                       <option value="1">Puerto Rico (+1)</option>
                                                    </select>
                                                
                                                    <input type="number" name="phone" placeholder="Phone" required />
                                                </div>

                                                <input type="password" name="password" placeholder="Password" required />
                                                <div class="button-box">
                                                    <button type="submit" name="register"><span>Register</span></button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- OTP Verification Form -->
                                        <div id="otp-form" style="display: none;">
                                            <form name="form3" action="" method="post">
                                                <h4 style="text-align: center; margin-bottom: 20px;">Verify Your Email</h4>
                                                <p style="text-align: center; margin-bottom: 20px; color: #666;">We've sent a 6-digit OTP to your email address. Please enter it below to complete your registration.</p>
                                                
                                                <input type="email" name="email" id="otp_email" placeholder="Email" readonly style="background-color: #f5f5f5;" value="" required />
                                                
                                                <input type="text" name="otp" placeholder="Enter 6-digit OTP" maxlength="6" pattern="[0-9]{6}" required style="text-align: center; font-size: 18px; letter-spacing: 3px;" />
                                                
                                                <div class="button-box">
                                                    <button type="submit" name="verify_otp"><span>Verify OTP</span></button>
                                                </div>
                                                
                                                <div style="text-align: center; margin-top: 15px;">
                                                    <a href="javascript:void(0)" onclick="showRegistrationForm()" style="color: #ff6000; text-decoration: none;">← Back to Registration</a>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- login area end -->
    
    <!-- Footer Area with Light Green Background -->
<footer class="footer-area" style="background-color: #a0b93a;">
    <!-- Main Footer Content -->
    <div class="footer-content">
        <div class="container">
            <div class="row">
                <!-- About Info Widget -->
                <div class="col-md-6 col-lg-3">
                    <div class="single-wedge">
                        <h4 class="footer-heading">About Info</h4>
                        <div class="footer-logo">
                            <a href="index.php">
                                <img src="https://getwayrom.com/assets/images/logo/footer_logo.png"
                                     alt="Footer Logo" class="img-fluid" style="max-width:220px;">
                            </a>
                        </div>
                        <div class="about-footer">
                            <div class="social-info">
                                <ul>
                                    <li><a href="#" target="_blank"><i class="ion-social-facebook"></i></a></li>
                                    <li><a href="#" target="_blank"><i class="ion-social-instagram"></i></a></li>
                                    <li><a href="#"><i class="ion-social-youtube"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- Traffic Counter -->
                        <div class="traffic-counter">
                            <script async src="https://cdn.livetrafficfeed.com/static/static-counter/live.v2.js"></script>
                            <noscript><a href="https://livetrafficfeed.com/website-counter">Traffic Count</a></noscript>
                        </div>
                    </div>
                </div>

                <!-- Information Links -->
                <div class="col-md-6 col-lg-3">
                    <div class="single-wedge">
                        <h4 class="footer-heading">Information</h4>
                        <div class="footer-links">
                            <ul>
                                <li><a href="index.php"><strong>Home</strong></a></li>
                                <li><a href="about.php"><strong>About Us</strong></a></li>
                                <li><a href="contact.php"><strong>Contact Us</strong></a></li>
                                <li><a href="login.php"><strong>Login</strong></a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Policies Links -->
                <div class="col-md-6 col-lg-3">
                    <div class="single-wedge">
                        <h4 class="footer-heading">Policies</h4>
                        <div class="footer-links">
                            <ul>
                                <li><a href="terms.php"><strong>Terms & Conditions</strong></a></li>
                                <li><a href="privacy.php"><strong>Privacy Policy</strong></a></li>
                                <!--<li><a href="shipping.php"><strong>Shipping Policy</strong></a></li>-->
                                <li><a href="return.php"><strong>Refund Policy</strong></a></li>
                                <!--<li><a href="cancellation.php"><strong>Cancellation Policy</strong></a></li>-->
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="col-md-6 col-lg-3">
                    <div class="single-wedge">
                        <h4 class="footer-heading">Contact Info</h4>
                        <div class="footer_address_area">
                            <!-- Address -->
                            <div class="footer_address_blk">
                                <div class="footer_address_blkinner">
                                    <div class="icon">
                                        <i class="fa fa-map-marker"></i>
                                    </div>
                                    <div class="content">
                                        <p>Address:</p>
                                        <h4>Mumbai-Goa Road, Amroy Complex, 2nd Floor, House No. 201, Near Railway Station, At. Post. Mangaon, Dist Raigad 402104</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- Phone -->
                            <div class="footer_address_blk">
                                <div class="footer_address_blkinner">
                                    <div class="icon">
                                        <i class="fas fa-phone-volume"></i>
                                    </div>
                                    <div class="content">
                                        <p>Contact for a Free Consultation:</p>
                                        <h4>+91 9420630774 / 7744820774</h4>
                                    </div>
                                </div>
                            </div>

                            <!-- WhatsApp -->
                            <div class="footer_address_blk">
                                <div class="footer_address_blkinner">
                                    <div class="icon">
                                        <i class="fab fa-whatsapp"></i>
                                    </div>
                                    <div class="content">
                                        <p>WhatsApp:</p>
                                        <h4>+91 9420630774 / 7744820774</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom" style="background-color: #859f1b;">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <p class="copy-text" style="color: #ffffff;">
                        Copyright &copy; 2026 Getwayrom. All Rights Reserved. 
                        Developed by <a href="https://webmantratech.com" target="_blank" rel="noopener">
                            <span style="color: #ffffff;">GetwayRom</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- WhatsApp Float Button -->
<div class="whatsapp-float-button">
    <a href="https://api.whatsapp.com/send?phone=917744820774&text=Namaste www.getwayrom.com" 
       class="float" target="_blank" rel="noopener">
        <i class="fab fa-whatsapp fa-3x my-float"></i>
    </a>
</div>


<!-- External CSS -->
<style>
/* Footer Styling */
.footer-area {
    background-color: #a0b93a;
    color: #333333;
    padding-top: 50px;
}

.footer-heading {
    color: #ffffff;
    font-weight: 800;
    margin-bottom: 20px;
    position: relative;
}

.footer-heading:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 50px;
    height: 2px;
    background: #859f1b;
}

.footer-links ul li {
    margin-bottom: 8px;
}

.footer-links ul li a {
    font-weight:600;
    color: #333333;
    transition: all 0.3s ease;
}

.footer-links ul li a:hover {
    font-weight:600;
    color: #ffffff;
    padding-left: 5px;
}

.social-info ul li {
    display: inline-block;
    margin-right: 10px;
}

.social-info ul li a {
    font-weight:700;
    color: #333333;
    font-size: 20px;
}

.footer_address_blk {
    margin-bottom: 15px;
}

.footer_address_blkinner {
    display: flex;
}

.footer_address_blkinner .icon {
    margin-right: 15px;
    min-width: 25px;
    color: #ff0000;
}

.footer_address_blkinner .content p {
    margin-bottom: 0;
    font-size: 14px;
}

.footer_address_blkinner .content h4 {
    font-size: 14px;
    font-weight: 500;
    margin-top: 3px;
}

.footer-bottom {
    padding: 15px 0;
    margin-top: 50px;
}

/* WhatsApp Button */
.whatsapp-float-button {
    position: fixed;
    bottom: 58px;
    right: 80px;
    z-index: 1000;
}

.float {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52px;
    height: 51px;
    background-color: #25d366;
    color: white;
    border-radius: 50%;
    text-decoration: none;
    box-shadow: 2px 2px 3px #999;
    transition: all 0.3s ease;
}

.float:hover {
    background-color: #ffdd00;
    transform: scale(1.1);
}

.my-float {
    margin: auto;
}
</style>

<!-- Load FontAwesome and Ionic icons asynchronously -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link rel="preload" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">    
</div>

<!-- Scripts to be loaded  -->
<script src="assets/js/vendor/jquery-3.5.1.min.js"></script>
<script src="assets/js/vendor/modernizr-3.7.1.min.js"></script>
<script src="assets/js/plugins.min.js"></script>
<script src="assets/js/main.js"></script>

<script>
// Make native select behave like a scrollable in-page box when focused (improves usability)
// It sets size on focus (shows multiple rows) and resets on blur/selection.
document.addEventListener('DOMContentLoaded', function(){
  var selects = document.querySelectorAll('select[name="country_code"]');
  selects.forEach(function(sel){
    sel.addEventListener('focus', function(){
      try { this.size = 8; } catch(e) {}
    });
    sel.addEventListener('blur', function(){
      try { this.size = 1; } catch(e) {}
    });
    // also collapse after change
    sel.addEventListener('change', function(){
      try { this.size = 1; } catch(e) {}
    });
  });
  
  // Check if OTP form should be shown
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reg_msg') === 'otp_sent' && urlParams.get('email')) {
    showOTPForm(urlParams.get('email'));
  }
  
  // Check if OTP form should be shown due to session data (only if URL parameter indicates OTP was sent)
    
  // Check if register tab should be active based on URL parameter
  if (urlParams.get('tab') === 'register') {
    // Switch to register tab
    document.querySelector('a[href="#lg1"]').classList.remove('active');
    document.querySelector('a[href="#lg2"]').classList.add('active');
    document.querySelector('#lg1').classList.remove('active');
    document.querySelector('#lg2').classList.add('active');
  }
});

// Function to show OTP form and hide registration form
function showOTPForm(email) {
  document.getElementById('registration-form').style.display = 'none';
  document.getElementById('otp-form').style.display = 'block';
  document.getElementById('otp_email').value = email;
  
  // Focus on OTP input
  setTimeout(function() {
    document.querySelector('input[name="otp"]').focus();
  }, 100);
}

// Function to show registration form and hide OTP form
function showRegistrationForm() {
  document.getElementById('otp-form').style.display = 'none';
  document.getElementById('registration-form').style.display = 'block';
  
  // Clear OTP form
  document.querySelector('input[name="otp"]').value = '';
  document.getElementById('otp_email').value = '';
  
  // Clear session data by making a request to clear it
  fetch('login.php?clear_session=1', {method: 'POST'})
    .then(() => {
      // Clear form fields
      document.querySelector('input[name="fullname"]').value = '';
      document.querySelector('input[name="email"]').value = '';
      document.querySelector('input[name="phone"]').value = '';
      document.querySelector('select[name="country_code"]').value = '';
      document.querySelector('input[name="password"]').value = '';
    })
    .catch(err => console.log('Error clearing session:', err));
}

// Auto-format OTP input (only numbers, max 6 digits)
document.addEventListener('DOMContentLoaded', function() {
  var otpInput = document.querySelector('input[name="otp"]');
  if (otpInput) {
    otpInput.addEventListener('input', function(e) {
      // Remove any non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Limit to 6 digits
      if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
      }
    });
    
    // Prevent non-numeric input
    otpInput.addEventListener('keypress', function(e) {
      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }
});
</script>

</body>
</html>
