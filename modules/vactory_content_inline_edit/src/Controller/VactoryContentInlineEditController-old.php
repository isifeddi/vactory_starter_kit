<?php

// namespace Drupal\vactory_content_inline_edit\Controller;

// use Drupal\Core\Controller\ControllerBase;
// use Drupal\node\Entity\Node;
// use Drupal\paragraphs\Entity\Paragraph;
// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Request;
// use Drupal\Component\Serialization\Json;

// /**
//  * The VactoryContentFeedbackController class.
//  */
// class VactoryContentInlineEditController extends ControllerBase
// {
//   /**
//    * @param Request $request
//    * @return JsonResponse
//    */
//   public function index(Request $request)
//   {
//     $nids = \Drupal::entityQuery('node')
//       ->condition('type', 'vactory_page')
//       ->execute();

//     // $nids = ["1"];


//     $nodes = Node::loadMultiple($nids);

//     $pageData = [];
//     foreach ($nodes as $node) {
//       if ($node && $node->hasField('field_vactory_paragraphs')) {
//         $paragraphsData = $node->get('field_vactory_paragraphs')->getValue();

//         $paragraphs = [];

//         foreach ($paragraphsData as $paragraphData) {
//           $paragraph = Paragraph::load($paragraphData['target_id']);
//           if ($paragraph) {

//             if ($paragraph && $paragraph->hasField('field_vactory_component')) {
//               $vactoryComponents = $paragraph->field_vactory_component->getValue();

//               foreach ($vactoryComponents as $component) {
//                 $widgetData = Json::decode($component['widget_data']);
//                 $widgetId = $component['widget_id'];

//                 // Fetch the widget configuration
//                 $widgetConfig = \Drupal::service('vactory_dynamic_field.vactory_provider_manager')->loadSettings($widgetId);

//                 // dump($widgetData);
//                 // dump($widgetConfig);

//                 // Now combine $widgetData with $widgetConfig
//                 $formattedData = $this->formatWidgetData($widgetData, $widgetConfig, $paragraphData['target_id']);

//                 $paragraphs[] = $formattedData;
//               }
//             }
//           }
//         }

//         $pageData[] = [
//           'nodeId' => $node->id(),
//           'title' => $node->getTitle(),
//           'paragraphs' => $paragraphs,
//         ];
//       }
//     }

//     return new JsonResponse($pageData);
//   }

//   public function saveChanges(Request $request)
//   {
//     $content = json_decode($request->getContent(), true);

//     $nodeId = $content['nodeId'] ?? NULL;
//     $paragraphId = $content['paragraphId'] ?? NULL;
//     $updatedData = $content['updatedData'] ?? NULL;

//     if (!$nodeId || !$updatedData) {
//       return new JsonResponse(['success' => FALSE, 'message' => 'Missing data', 'c' => $content], 400);
//     }

//     $node = Node::load($nodeId);
//     if (!$node) {
//       return new JsonResponse(['success' => FALSE, 'message' => 'Node not found'], 400);
//     }

//     $paragraph = Paragraph::load($paragraphId);
//     if (!$paragraph) {
//       return new JsonResponse(['success' => FALSE, 'message' => 'Paragraph not found'], 404);
//     }

//     $paragraphsField = $node->get('field_vactory_paragraphs');
//     $paragraphsData = $paragraphsField->getValue();

//     $widget = $paragraph->field_vactory_component->getValue()[0];
//     $widget_id = $widget['widget_id'];
//     $widgetDataJson = $widget['widget_data'];
//     $widgetData = Json::decode($widgetDataJson);

//     // Update extra fields
//     if (isset($updatedData['extra_fields'])) {
//       foreach ($updatedData['extra_fields'] as $fieldName => $fieldValue) {
//         $widgetData['extra_field'][$fieldName] = $fieldValue;
//       }
//     }

//     // Update numbered components
//     if (isset($updatedData['components'])) {
//       foreach ($updatedData['components'] as $componentIndex => $componentFields) {
//         if (!isset($widgetData[$componentIndex])) {
//           $widgetData[$componentIndex] = [];
//         }
//         foreach ($componentFields as $fieldName => $fieldValue) {
//           $widgetData[$componentIndex][$fieldName] = $fieldValue;
//         }
//       }
//     }
//     dump(Json::encode($widgetData));
//     $paragraph->field_vactory_component->setValue([['widget_id' => $widget_id, 'widget_data' => Json::encode($widgetData)]]);
//     $paragraph->save();

//     // Update the target_revision_id for the paragraph reference
//     // Revisions are disbaled from Paragraph i guess
//     // foreach ($node->get('field_vactory_paragraphs')->getValue() as &$paragraphRef) {
//     //   if ($paragraphRef['target_id'] == $paragraphId) {
//     //     $paragraphRef['target_revision_id'] = $paragraph->getRevisionId();
//     //   }
//     // }

//     // Set the updated paragraphs data back to the node and save it
//     //dump($paragraphsData);
//     // $node->get('field_vactory_paragraphs')->setValue($paragraphsData);
//     // $node->save();


//     return new JsonResponse(['success' => TRUE, 'message' => 'Node and Paragraphs updated']);
//   }

//   private function formatWidgetData($widgetData, $widgetConfig, $paragraphId)
//   {
//     $formattedData = [];
//     $formattedData["paragraphId"] = $paragraphId;
//     $formattedData["name"] = $widgetConfig["name"];

//     // Process regular fields
//     foreach ($widgetData as $key => $fieldGroup) {
//       if ($key === 'extra_field') {
//         // Process extra fields
//         foreach ($fieldGroup as $extraFieldName => $extraFieldValue) {
//           if (
//             isset($widgetConfig['extra_fields'][$extraFieldName])
//             && $widgetConfig['extra_fields'][$extraFieldName]['type'] === 'text'
//           ) {
//             $extraFieldConfig = $widgetConfig['extra_fields'][$extraFieldName];
//             $formattedData["elements"]["extra_fields"][$extraFieldName] = $this->processField($extraFieldValue, $extraFieldConfig);
//           }
//         }
//       } else if (is_numeric($key) && is_array($fieldGroup)) {
//         // Process regular field groups (indexed numerically)
//         foreach ($fieldGroup as $fieldName => $fieldValue) {
//           if (
//             isset($widgetConfig['fields'][$fieldName])
//             && $widgetConfig['fields'][$fieldName]['type'] === 'text'
//           ) {
//             $fieldConfig = $widgetConfig['fields'][$fieldName];

//             $formattedData["elements"]["components"][$key][$fieldName] = $this->processField($fieldValue, $fieldConfig);
//           }
//         }
//       }
//     }

//     return $formattedData;
//   }

//   private function processField($fieldValue, $fieldConfig)
//   {
//     return $fieldValue;
//     // Process the field based on its type
//     // switch ($fieldConfig['type']) {
//     //   case 'text':
//     //   case 'textarea':
//     //     return $fieldValue; // For text and textarea, return as is
//     //   case 'text_format':
//     //     return $this->processFormattedText($fieldValue); // For formatted text
//     //     // Add cases for other field types as needed
//     // }

//     return $fieldValue; // Default return
//   }

//   private function processFormattedText($formattedText)
//   {
//     // Process formatted text (e.g., stripping tags, converting formats)
//     // Implement according to your requirements
//     return strip_tags($formattedText['value']); // Assuming the text is in 'value'
//   }
// }
