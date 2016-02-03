#EPAM's Product Comparison #
The repo exposes ui directives for "Product Comparison" service, distributed through YAAS Market.

#Get Started#

Example usage of directives based on [Yaas storefront](https://github.com/SAP/yaas-storefront) 
1. Subscribe your application to EPAM's Product Comparison package on YAAS Market.

2. Download YAAS storefront from https://github.com/SAP/yaas-storefront

3. Change `PROJECT_ID` and `CLIENT_ID` in `gruntfile.j`s to the credentials of your app

4. Add dependency to bower.json

        "dependencies": {
            "epam-product-comparison-yaas": "0.0.2"
        } 
        
5. Run `npm install`. After task finishes you will have `epam-product-comparison-yaas` package in `public/js/app/vendor` folder

6. Add js dependencies to index.html

        <script src="js/vendor/epam-product-comparison-yaas/productcomparison.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/controllers/product-comparison-ctrl.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/directives/comparison-button.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/directives/comparison-count-header.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/services/productcomparison-rest.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/services/productcomparison-service.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/shared/scroll-top-btn.js"></script>
        <script src="js/vendor/epam-product-comparison-yaas/shared/spinner.js"></script>
        
7. Also check or add next module into your application:

        "remarkable-bootstrap-notify"
        "angular-spinner"
        "restangular"
        "angular"
        "bootstrap"
        "restangular"
        "spin.js"
        "lodash"
        
Note, that you can find all this loaded modules in the same folder with epam-product-comparison-yaas.

8. Add css dependencies to index.html

        <link href="js/vendor/css/comparison.css" rel="stylesheet">
        
9. Modify `product-detail.html` and `product-list.html`. Add button for add/remove product for these pages.

        <comparison-button product="product.product"></comparison-button>
10. Modify `top-navigation.html`. Add information of count products in comparison ![Product Comparison](https://pp.vk.me/c629313/v629313233/2f415/Lp5ZvO93YbI.jpg)

        <div data-comparison-count></div>

11. Added products will appear in your store by clicking on `count of products(that you add in previous step)` or by clicking on `popup on the right top corner of the page`

#Good luck and use Product Comparison!#
![Add/Remove buttons](https://pp.vk.me/c629313/v629313233/2f451/4MNXCOrVqOU.jpg)
![Product Comparison](https://pp.vk.me/c629313/v629313233/2f41e/4QYS33WKTbE.jpg)

License

The MIT License

Copyright (c) 2016 Epam Systems, https://www.epam.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
