$(document).ready(function () {
    // Open Sign Up Popup
    $(".logup-btn").click(function () {
        $("#logupPopup").addClass("active");
    });

    // Open Login Popup
    $(".login-btn").click(function () {
        $("#loginPopup").addClass("active");
    });

    // Close Popups
    $(".close-btn").click(function () {
        $(".popup").removeClass("active");
    });

    // Handle Sign Up Form Submission with Basic Validation
    $("#logupForm").submit(function (event) {
        event.preventDefault(); // Prevent form submission

        let name = $("input[name='name']").val().trim();
        let email = $("input[name='email']").val().trim();
        let username = $("input[name='username']").val().trim();
        let password = $("input[name='password']").val().trim();
        let isValid = true;
        let errorMessage = "";

        // Basic validation
        if (name === "" || email === "" || username === "" || password === "") {
            errorMessage = "All fields are required.";
            isValid = false;
        } else if (!validateEmail(email)) {
            errorMessage = "Please enter a valid email address.";
            isValid = false;
        } else if (password.length < 6) {
            errorMessage = "Password must be at least 6 characters long.";
            isValid = false;
        }

        let formData = {
            name: name,
            email: email,
            username: username,
            password: password
        };

        $.ajax({
            url: "/signup",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response);
                $("#logupPopup").removeClass("active");
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText); // Alerts if username is taken or other errors occur
            }
        });

    });

    // Handle Login Form Submission with Basic Validation
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Prevent form default submission

        let username = $("input[name='uusername']").val().trim();
        let password = $("input[name='upassword']").val().trim();

        if (username === "" || password === "") {
            alert("Username and password are required.");
            return;
        }

        let formData = {
            username: username,
            password: password
        };

        $.ajax({
            url: "/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response);
                $("#loginPopup").removeClass("active");
                // On successful login, remove the "buttons-act" class from the buttons container
                $(".buttons").removeClass("buttons-act");
            },
            error: function (xhr) {
                alert("Error: " + xhr.responseText);
            }
        });
    });


    // Email validation function
    function validateEmail(email) {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    const $shapeContainer = $(".background-shapes");

    function createShape() {
        let $shape = $("<div class='shape'></div>");

        if (Math.random() > 0.5) {
            $shape.addClass("square");
        }

        let size = Math.random() * 30 + 20; // Random size between 20-50px
        $shape.css({
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${Math.random() * 4 + 3}s`
        });

        $shapeContainer.append($shape);

        setTimeout(() => {
            $shape.remove();
        }, 7000); // Remove shapes after animation
    }

    setInterval(createShape, 1000);
});
