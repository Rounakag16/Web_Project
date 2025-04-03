$(document).ready(function () {
    $("#donationForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        var formData = new FormData(this);
        var responseMessage = $("#responseMessage");

        $.ajax({
            url: "/donor",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    responseMessage.css("color", "green").text(response.message);
                    $("#donationForm")[0].reset(); // Reset form after success
                } else {
                    responseMessage.css("color", "red").text(response.message);
                }
            },
            error: function () {
                responseMessage.css("color", "red").text("An unexpected error occurred.");
            }
        });
    });
});
