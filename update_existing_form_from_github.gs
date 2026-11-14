// Existing-form image updater. Fill in the two constants below.
const FORM_EDIT_URL = 'PASTE_FORM_EDIT_URL_HERE';
const RAW_BASE_URL = 'https://raw.githubusercontent.com/va1bhavagrawal/cvpr-27-user-study/main/images/';
const IMAGE_FILES = ["01_vi_043.jpg","02_vi_141.jpg","03_vi_219.jpg","04_vi_154.jpg","05_vi_145.jpg","06_vi_022.jpg","07_vi_033.jpg","08_vi_279.jpg","09_vi_150.jpg","10_vi_137.jpg","11_vi_045.jpg","12_vi_040.jpg","13_vi_006.jpg","14_vi_138.jpg","15_vi_144.jpg","16_vi_011.jpg","17_vi_021.jpg","18_vi_007.jpg","19_vi_005.jpg","20_vi_020.jpg","21_vi_039.jpg","22_vi_152.jpg","23_vi_002.jpg","24_vi_271.jpg","25_en_314.jpg","26_en_165.jpg","27_en_175.jpg","28_en_256.jpg","29_en_159.jpg","30_en_203.jpg","31_en_254.jpg","32_en_308.jpg","33_en_260.jpg","34_en_206.jpg","35_en_205.jpg","36_en_210.jpg","37_en_178.jpg","38_en_168.jpg","39_en_250.jpg","40_en_086.jpg","41_en_202.jpg","42_en_249.jpg","43_en_155.jpg","44_en_216.jpg","45_en_226.jpg","46_en_265.jpg","47_en_263.jpg","48_en_051.jpg"];

// Run batches 1 through 6. Each batch updates eight existing image items.
function updateFormImagesBatch(batchNumber) {
  if (!Number.isInteger(batchNumber) || batchNumber < 1 || batchNumber > 6) {
    throw new Error('Batch number must be 1 through 6');
  }
  if (!FORM_EDIT_URL.includes('/edit') || RAW_BASE_URL.includes('/OWNER/REPO/COMMIT/')) {
    throw new Error('Set FORM_EDIT_URL and RAW_BASE_URL first');
  }
  const form = FormApp.openByUrl(FORM_EDIT_URL);
  const images = form.getItems(FormApp.ItemType.IMAGE).map(item => item.asImageItem());
  const questions = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
  if (images.length !== 48 || questions.length !== 48) {
    throw new Error('Expected 48 image items and 48 A/B questions; found ' + images.length + ' and ' + questions.length);
  }
  const start = (batchNumber - 1) * 8;
  const files = IMAGE_FILES.slice(start, start + 8);
  files.forEach((filename, offset) => {
    const expected = 'Example ' + (start + offset + 1);
    if (images[start + offset].getTitle() !== expected) {
      throw new Error('Image order mismatch at ' + expected + ': ' + images[start + offset].getTitle());
    }
  });
  const urls = files.map(filename => RAW_BASE_URL + encodeURIComponent(filename));
  const responses = UrlFetchApp.fetchAll(urls.map(url => ({url, muteHttpExceptions: true})));
  responses.forEach((response, offset) => {
    const headers = response.getHeaders();
    const type = Object.keys(headers).find(key => key.toLowerCase() === 'content-type');
    if (response.getResponseCode() !== 200 || !String(headers[type] || '').startsWith('image/')) {
      throw new Error('Image fetch failed: ' + urls[offset] + ' (' + response.getResponseCode() + ')');
    }
  });
  responses.forEach((response, offset) => {
    images[start + offset].setImage(response.getBlob().setName(files[offset]));
  });
  console.log('Updated examples ' + (start + 1) + '–' + (start + 8) + ' in ' + form.getEditUrl());
}

function updateBatch1() { updateFormImagesBatch(1); }
function updateBatch2() { updateFormImagesBatch(2); }
function updateBatch3() { updateFormImagesBatch(3); }
function updateBatch4() { updateFormImagesBatch(4); }
function updateBatch5() { updateFormImagesBatch(5); }
function updateBatch6() { updateFormImagesBatch(6); }
