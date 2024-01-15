(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.vactoryContentInlineEditFetch = {
        // attach: function (context, settings) {
        //     const fetchUrl = drupalSettings.vactoryContentInlineEdit.fetchUrl;
        //     const tableBody = $("#content-inline-edit-table tbody", context);

        //     $.ajax({
        //         url: fetchUrl,
        //         method: "GET",
        //         dataType: "json",
        //         success: function (data) {
        //             tableBody.empty();
        //             data.forEach((nodeData) =>
        //                 tableBody.append(
        //                     Drupal.vactoryContentInlineEditUI.createNodeRow(
        //                         nodeData
        //                     )
        //                 )
        //             );
        //         },
        //         error: function (error) {
        //             console.error("Error fetching data:", error);
        //         },
        //     });
        // },
        saveData: function (
            nodeId,
            paragraphId,
            updatedData,
            onSuccess,
            onError
        ) {
            $.ajax({
                url: "/vactory-content-inline-edit/save",
                method: "POST",
                contentType: "application/json", // Set the content type to JSON
                dataType: "json",
                data: JSON.stringify({
                    nodeId: nodeId,
                    paragraphId: paragraphId,
                    updatedData: updatedData,
                }),
                success: onSuccess,
                error: onError,
            });
        },
    };
})(jQuery, Drupal, drupalSettings);
