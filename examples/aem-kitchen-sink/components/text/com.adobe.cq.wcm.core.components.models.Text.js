/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
// package com.adobe.cq.wcm.core.components.models;
//
// import org.jetbrains.annotations.NotNull;
// import org.osgi.annotation.versioning.ConsumerType;
//
// import com.adobe.cq.export.json.ComponentExporter;

// copied from:
// https://github.com/adobe/aem-core-wcm-components/blob/master/bundles/core/src/main/java/com/adobe/cq/wcm/core/components/models/Text.java

/**
 * Defines the {@code Text} Sling Model used for the {@code /apps/core/wcm/components/text} component.
 *
 * @since com.adobe.cq.wcm.core.components.models 11.0.0
 */
//@ConsumerType
//public interface Text extends ComponentExporter {
module.exports = class Text {
  use() {
    return {
      /**
       * Retrieves the text value to be displayed.
       *
       * @return the text value to be displayed, or {@code null} if no value can be returned
       * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
       */
      get text() {
        return 'example text';
      },

      /**
       * Checks if the text to be displayed is rich text or not.
       *
       * @return {@code true} if the text is rich (HTML formatting), {@code false otherwise}
       * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
       */
      get isRichText() {
        return false;
      },

      /**
       * @see ComponentExporter#getExportedType()
       * @since com.adobe.cq.wcm.core.components.models 12.2.0
       */
      get exportedType() {
        return 'text';
      }
    }
  }
}