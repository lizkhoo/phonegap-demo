var app = {

    //use emplyoeeLiTpl template to create HTML--moved to homeview.js
    // findByName: function() {
    //     var self = this;
    //     this.store.findByName($('.search-key').val(), function(employees) {
    //         $('.employee-list').html(self.employeeLiTpl(employees));
    //     });
    // },

    initialize: function() {
        //self is the app
        var self = this;

        // regular expression that matches employee details urls
        this.detailsURL = /^#employees\/(\d{1,})/;

        //invoke registerEvents
        this.registerEvents();

        this.store = new MemoryStore(function() {
            self.route();
        });

    },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    
    registerEvents: function() {
        var self = this;
        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }

        //event listener to listen to URL hash tag changes
        $(window).on('hashchange', $.proxy(this.route, this));
    },


    //function to style page changes
    slidePage: function(page) {
 
    var currentPageDest;
    var self = this;
 
    // If there is no current page (app just started) -> No transition: Position new page in the view port -- add homePage id
    if (!this.currentPage) {
        $(page.el).attr('class', 'page stage-center').attr('id','homePage');
        $('body').append(page.el);
        this.currentPage = page;
        return;
    }
 
    // Cleaning up: remove old pages that were moved out of the viewport --based on homePage ID
    $('.stage-right, .stage-left').not('#homePage').remove();
 
    if (page === app.homePage) {
        // Always apply a Back transition (slide from left) when we go back to the search page
        $(page.el).attr('class', 'page stage-left');
        currentPageDest = "stage-right";
    } else {
        // Forward transition (slide from right)
        $(page.el).attr('class', 'page stage-right');
        currentPageDest = "stage-left";
    }
 
    $('body').append(page.el);
 
    // Wait until the new page has been added to the DOM...
    setTimeout(function() {
        // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
        $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
        // Slide in the new page
        $(page.el).attr('class', 'page stage-center transition');
        self.currentPage = page;
    });
 
    },

      //route requests to the appropriate view
    route: function() {
        var hash = window.location.hash;
        var self = this;

        //If there is no hashtag in the URL: display the HomeView
        if (!hash) {
            if (this.homePage) {
                this.slidePage(this.homePage);
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
            return;
        }

        /*If there is a hashtag matching the pattern for an employee details 
        URL: display an EmployeeView for the specified employee*/
        var match = hash.match(app.detailsURL); 
        if (match) {
            this.store.findById(Number(match[1]), function(employee) {
                self.slidePage(new EmployeeView(employee).render());
            });
        }
    }


    //use the homeTpl to create HTMl--replaced by render() in homeview.js
    // renderHomeView: function() {
    //     $('body').html(this.homeTpl());
    //     $('.search-key').on('keyup', $.proxy(this.findByName, this));
    // }

};

app.initialize();