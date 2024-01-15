// (function ($, Drupal) {
//     Drupal.vactoryContentInlineEditUI = {
//         processData: function () {
//             const _this = this; // Preserve the reference to Drupal.vactoryContentInlineEditUI
//             const widgetContainers = $(".widget-container");
//             widgetContainers.each(function () {
//                 const widgetContainer = $(this);
//                 const nodeId = widgetContainer.data("node-id");
//                 const paragraphId = widgetContainer.data("paragraph-id");
//                 widgetContainer.find("p.widget-field").each(function () {
//                     const pTag = $(this);
//                     const fieldName = pTag.data("field-name");
//                     const fieldValue = pTag.text();
//                     const isExtraField = pTag.data("is-extra-field");
//                     const fieldInput =
//                         isExtraField === "true"
//                             ? _this.createFieldInput(
//                                   fieldName,
//                                   fieldValue,
//                                   nodeId,
//                                   paragraphId,
//                                   isExtraField
//                               )
//                             : _this.createFieldInput(
//                                   fieldName,
//                                   fieldValue,
//                                   nodeId,
//                                   paragraphId,
//                                   isExtraField,
//                                   pTag.data("component-index")
//                               );
//                     pTag.replaceWith(fieldInput);
//                 });
//             });
//         },
//         // createNodeRow: function (nodeData) {
//         //     const row = $("<tr>");
//         //     row.append($("<td>").text(nodeData.title));

//         //     const paragraphsCell = $("<td>");
//         //     const paragraphsDiv = $("<div>").addClass("paragraphs-cell");
//         //     nodeData.paragraphs.forEach((paragraph) =>
//         //         paragraphsDiv.append(
//         //             this.createWidgetContainer(nodeData.nodeId, paragraph)
//         //         )
//         //     );

//         //     paragraphsCell.append(paragraphsDiv);
//         //     row.append(paragraphsCell);
//         //     return row;
//         // },

//         // createWidgetContainer: function (nodeId, paragraph) {
//         //     const widgetContainer = $("<div>").addClass("widget-container");
//         //     const widgetTitle = $("<div>")
//         //         .addClass("widget-title")
//         //         .text(paragraph.name);
//         //     widgetContainer.append(widgetTitle);

//         //     // Safely handle extra fields
//         //     const extraFields =
//         //         paragraph.elements && paragraph.elements.extra_fields
//         //             ? paragraph.elements.extra_fields
//         //             : {};
//         //     Object.entries(extraFields).forEach(([fieldName, fieldValue]) => {
//         //         const fieldInput = this.createFieldInput(
//         //             fieldName,
//         //             fieldValue,
//         //             nodeId,
//         //             paragraph.paragraphId,
//         //             true
//         //         );
//         //         widgetContainer.append(fieldInput);
//         //     });

//         //     // Safely handle components
//         //     const components =
//         //         paragraph.elements && paragraph.elements.components
//         //             ? paragraph.elements.components
//         //             : [];
//         //     components.forEach((component, index) => {
//         //         Object.entries(component).forEach(([fieldName, fieldValue]) => {
//         //             const fieldInput = this.createFieldInput(
//         //                 fieldName,
//         //                 fieldValue,
//         //                 nodeId,
//         //                 paragraph.paragraphId,
//         //                 false,
//         //                 index
//         //             );
//         //             widgetContainer.append(fieldInput);
//         //         });
//         //     });

//             // Add loader to the widget container
//             // const loader = $("<div>").addClass("loader");
//             // widgetContainer.append(loader);

//         //     return widgetContainer;
//         // },
//         createFieldInput: function (
//             fieldName,
//             fieldValue,
//             nodeId,
//             paragraphId,
//             isExtraField,
//             componentIndex = null
//         ) {
//             const fieldInput = $("<input>")
//                 .attr({
//                     type: "text",
//                     value: fieldValue,
//                     "data-node-id": nodeId,
//                     "data-paragraph-id": paragraphId,
//                     "data-field-name": fieldName,
//                     "data-is-extra-field": isExtraField,
//                 })
//                 .addClass("widget-field");

//             // Store the original value
//             fieldInput.data("original-value", fieldValue);

//             if (componentIndex !== null) {
//                 fieldInput.attr("data-component-index", componentIndex);
//             }

//             // Bind 'input' event for immediate detection of changes
//             fieldInput.on("input", function () {
//                 Drupal.vactoryContentInlineEditUI.showEditControls(
//                     $(this).closest(".widget-container")
//                 );
//             });

//             return fieldInput;
//         },

//         // Event delegation for dynamically added fields
//         bindFieldEvents: function () {
//             $(document).on("input", ".widget-field", function () {
//                 Drupal.vactoryContentInlineEditUI.showEditControls(
//                     $(this).closest(".widget-container")
//                 );
//             });
//         },

//         showEditControls: function (container) {
//             if (container.find(".edit-controls").length === 0) {
//                 const cancelButton = $("<span>")
//                     .addClass("icon-cancel")
//                     .text("x");
//                 const saveButton = $("<span>").addClass("icon-save").text("✓");
//                 const controlsDiv = $("<div>")
//                     .addClass("edit-controls")
//                     .css("display", "block");

//                 controlsDiv.append(saveButton, cancelButton);
//                 container.append(controlsDiv);

//                 // Correctly reference the methods
//                 saveButton.on("click", () => this.saveChanges(container));
//                 cancelButton.on("click", () => this.cancelChanges(container));
//             } else {
//                 // If edit controls already exist, make sure they are visible
//                 container.find(".edit-controls").css("display", "block");
//             }
//         },

//         saveChanges: function (container) {
//             let _this = this; // Preserve the reference to Drupal.vactoryContentInlineEditUI

//             let updatedData = {
//                 extra_fields: {},
//                 components: [],
//             };

//             container.find(".widget-field").each(function () {
//                 const fieldInput = $(this);
//                 const fieldName = fieldInput.data("field-name");
//                 const fieldValue = fieldInput.val();
//                 const isExtraField = fieldInput.data("is-extra-field");

//                 if (isExtraField) {
//                     updatedData.extra_fields[fieldName] = fieldValue;
//                 } else {
//                     // Assuming component index is available as a data attribute
//                     const componentIndex = fieldInput.data("component-index");
//                     if (updatedData.components[componentIndex] === undefined) {
//                         updatedData.components[componentIndex] = {};
//                     }
//                     updatedData.components[componentIndex][fieldName] =
//                         fieldValue;
//                 }
//             });

//             console.log("uuu >>", updatedData);

//             const nodeId = container
//                 .find(".widget-field")
//                 .first()
//                 .data("node-id");

//             const paragraphId = container
//                 .find(".widget-field")
//                 .first()
//                 .data("paragraph-id");

//             _this.showLoader(container); // Show loader before saving

//             // Call the saveData function from vactory-content-inline-fetch.js
//             Drupal.behaviors.vactoryContentInlineEditFetch.saveData(
//                 nodeId,
//                 paragraphId,
//                 updatedData,
//                 function (response) {
//                     // Success callback
//                     console.log(container.html());
//                     // console.log("Update successful:", response);
//                     _this.hideLoader(container);
//                     container.find(".edit-controls").remove();
//                 },
//                 function (error) {
//                     // Error callback
//                     console.error("Error updating data:", error);
//                     _this.hideLoader(container);
//                 }
//             );
//         },

//         cancelChanges: function (container) {
//             console.log("coco", container);
//             container.find(".widget-field").each(function () {
//                 const originalValue = $(this).data("original-value");
//                 if (originalValue !== undefined) {
//                     $(this).val(originalValue);
//                 }
//             });
//             container.find(".edit-controls").remove();
//         },

//         showLoader: function (container) {
//             container.find(".edit-controls").hide(); // Hide edit controls
//             container.find(".loader").show(); // Show loader
//         },

//         hideLoader: function (container) {
//             container.find(".loader").hide(); // Hide loader
//         },
//     };

//     // Initialize the event binding
//     $(document).ready(function () {
//         Drupal.vactoryContentInlineEditUI.processData();
//         Drupal.vactoryContentInlineEditUI.bindFieldEvents();
//     });
// })(jQuery, Drupal);

(function ($, Drupal) {
    Drupal.vactoryContentInlineEditUI = {
        // Event delegation for dynamically added fields
        bindFieldEvents: function () {
            $(document).on(
                "input",
                ".paragraph-field, .paragraph-url-extended-field",
                function () {
                    Drupal.vactoryContentInlineEditUI.showEditControls(
                        $(this).closest(".paragraph-wrapper")
                    );
                }
            );
        },

        showEditControls: function (container) {
            if (container.find(".edit-controls").length === 0) {
                const cancelButton = $("<span>")
                    .addClass("icon-cancel")
                    .text("x");
                const saveButton = $("<span>").addClass("icon-save").text("✓");
                const controlsDiv = $("<div>")
                    .addClass("edit-controls")
                    .css("display", "block");

                controlsDiv.append(cancelButton, saveButton);
                container.append(controlsDiv);

                // Correctly reference the methods
                saveButton.on("click", () => this.saveChanges(container));
                cancelButton.on("click", () => this.cancelChanges(container));
            } else {
                // If edit controls already exist, make sure they are visible
                container.find(".edit-controls").css("display", "block");
            }
        },

        saveChanges: function (container) {
            let _this = this; // Preserve the reference to Drupal.vactoryContentInlineEditUI

            let updatedData = {
                extra_fields: {},
                components: [],
            };

            container.find(".paragraph-field").each(function () {
                const fieldInput = $(this);
                const fieldName = fieldInput.data("field-name");
                const fieldFormat = fieldInput.data("field-format");
                const fieldValue = fieldInput.val();
                const isExtraField = fieldInput.data("is-extra-field");

                if (isExtraField) {
                    if (fieldFormat) {
                        updatedData.extra_fields[fieldName]["value"] =
                            fieldValue;
                        updatedData.extra_fields[fieldName]["format"] =
                            fieldFormat;
                    } else {
                        updatedData.extra_fields[fieldName] = fieldValue;
                    }
                } else {
                    // Assuming component index is available as a data attribute
                    const componentIndex = fieldInput.data("component-index");
                    if (updatedData.components[componentIndex] === undefined) {
                        updatedData.components[componentIndex] = {};
                    }
                    if (fieldFormat) {
                        updatedData.components[componentIndex][
                            fieldName
                        ].value = fieldValue;
                        updatedData.components[componentIndex][
                            fieldName
                        ].format = fieldFormat;
                    } else {
                        updatedData.components[componentIndex][fieldName] =
                            fieldValue;
                    }
                }
            });

            container.find(".paragraph-url-extended-field").each(function () {
                const $fieldset = $(this);
                const fieldName = $fieldset.data("field-name");
                const isExtraField = $fieldset.data("is-extra-field");

                let urlData = {};
                $fieldset.find('input[type="text"]').each(function () {
                    const $input = $(this);
                    const inputName = $input.attr("name");

                    // Determine which original value to use based on the field name
                    if (inputName.includes("title")) {
                        urlData.title = $input.val();
                        console.log("title", urlData);
                    } else if (inputName.includes("url")) {
                        urlData.url = $input.val();
                        console.log("url", urlData);
                    }
                    if (isExtraField) {
                        updatedData.extra_fields[fieldName] = urlData;
                    } else {
                        const componentIndex =
                            $fieldset.data("component-index");
                        if (
                            updatedData.components[componentIndex] === undefined
                        ) {
                            updatedData.components[componentIndex] = {};
                        }
                        updatedData.components[componentIndex][fieldName] =
                            urlData;
                    }
                });
            });

            console.log("uuu >>", updatedData);

            const nodeId = container
                .find(".paragraph-field")
                .first()
                .data("node-id");

            const paragraphId = container
                .find(".paragraph-field")
                .first()
                .data("paragraph-id");

            _this.showLoader(container); // Show loader before saving

            // _this.triggerFormValidation();

            // Call the saveData function from vactory-content-inline-fetch.js
            Drupal.behaviors.vactoryContentInlineEditFetch.saveData(
                nodeId,
                paragraphId,
                updatedData,
                function (response) {
                    // Success callback
                    console.log(container.html());
                    // console.log("Update successful:", response);
                    _this.hideLoader(container);
                    container.find(".edit-controls").remove();
                },
                function (error) {
                    // Error callback
                    console.error("Error updating data:", error);
                    _this.hideLoader(container);
                }
            );
        },

        cancelChanges: function (container) {
            container.find(".paragraph-field").each(function () {
                const originalValue = $(this).data("original-value");
                console.log("coco", originalValue);
                if (originalValue !== undefined) {
                    $(this).val(originalValue);
                }
            });
            container.find(".paragraph-url-extended-field").each(function () {
                const $fieldset = $(this);
                $fieldset.find('input[type="text"]').each(function () {
                    const $input = $(this);
                    const fieldName = $input.attr("name");

                    // Determine which original value to use based on the field name
                    if (fieldName.includes("title")) {
                        $input.val($fieldset.data("original-title"));
                    } else if (fieldName.includes("url")) {
                        $input.val($fieldset.data("original-url"));
                    }
                });
            });
            container.find(".edit-controls").remove();
        },

        showLoader: function (container) {
             // Add loader to the widget container
            const loader = $("<div>").addClass("loader");
            container.append(loader);
            container.find(".edit-controls").hide(); // Hide edit controls
            container.find(".loader").show(); // Show loader
        },

        hideLoader: function (container) {
            container.find(".loader").hide(); // Hide loader
        },
        // triggerFormValidation: function () {
        //     jQuery('input[type="submit"].ajax-submit-button').click();
        // },
    };

    // Initialize the event binding
    $(document).ready(function () {
        Drupal.vactoryContentInlineEditUI.bindFieldEvents();
    });
})(jQuery, Drupal);
