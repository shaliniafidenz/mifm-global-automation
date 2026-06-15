'use strict';

/**
 * Test data for PPM Filter test suite.
 *
 * Building IDs are fixed (provided by the app).
 * Floor / Space / Asset / Service Category IDs are resolved at runtime by
 * selecting the first available item from the dropdown.
 */
module.exports = {

    // ── Expected UI text ────────────────────────────────────────────────────────
    expectedFilterTitle: 'Filter PPM Work Order',
    expectedPpmTitle:    'PPM Work Order',

    // ── All buildings available in the filter ───────────────────────────────────
    buildings: [
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_1', name: 'Certis(Site).CW' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_2', name: '10 MBC' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_3', name: 'HL7 Building' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_4', name: 'Certis(Site).East Coast' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_5', name: 'Site_1.B1' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_6', name: 'Site_1.B2' },
        { resourceId: 'cwo_filter_buildingItems_dropdown_list_item_7', name: 'Site_1.B3' },
    ],

    // ── Primary building used by TC01 – TC08 ────────────────────────────────────
    defaultBuilding: {
        resourceId: 'cwo_filter_buildingItems_dropdown_list_item_1',
        name:       'Certis(Site).CW',
    },

    // ── Alternate building used by TC09 (Service Category scenario) ─────────────
    tc09Building: {
        resourceId: 'cwo_filter_buildingItems_dropdown_list_item_2',
        name:       '10 MBC',
    },
};
