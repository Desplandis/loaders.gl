import test from 'tape-promise/tape';
import {isBrowser} from '@loaders.gl/core';
import {NodeIndexDocument} from '../../../src/i3s-converter/helpers/node-index-document';
import I3SConverter from '../../../src/i3s-converter/i3s-converter';
import WriteQueue from '../../../src/lib/utils/write-queue';

const getConverter = ({slpk, instantNodeWriting} = {slpk: false, instantNodeWriting: false}) => {
  const converter = new I3SConverter();
  converter.options = {
    slpk,
    instantNodeWriting
  };
  converter.layers0Path = '.data/node-pages-test/layers/0';
  converter.writeQueue = new WriteQueue();
  return converter;
};

test('tile-converter - I3SConverter#NodePages', async (t) => {
  if (isBrowser) {
    t.end();
    return;
  }

  t.test('Should create an instance of NodeIndexDocument class', async (st) => {
    const node = new NodeIndexDocument(0, getConverter());
    st.ok(node instanceof NodeIndexDocument);
    st.equal(node.inPageId, 0);
    st.equal(node.id, 'root');
    st.end();
  });

  t.test('Should create root node', async (st) => {
    const node = await NodeIndexDocument.createRootNode(
      {obb: {center: [1, 1, 1], halfSize: [2, 3, 4], quaternion: [4, 3, 2, 1]}, mbs: [1, 2, 3, 4]},
      getConverter()
    );
    st.ok(node instanceof NodeIndexDocument);
    st.equal(node.inPageId, 0);
    st.equal(node.id, 'root');
    st.end();
  });

  t.test('Should create root node', async (st) => {
    const obb = {center: [1, 1, 1], halfSize: [2, 3, 4], quaternion: [4, 3, 2, 1]};
    const parentNode = await NodeIndexDocument.createRootNode(
      {obb, mbs: [1, 2, 3, 4]},
      getConverter()
    );
    const nodeInPage = {index: 5, obb};
    const emptyResources = {
      geometry: null,
      compressedGeometry: null,
      texture: null,
      sharedResources: null,
      meshMaterial: null,
      vertexCount: null,
      attributes: null,
      featureCount: null,
      boundingVolumes: null,
      hasUvRegions: false
    };
    const node = await NodeIndexDocument.createNode(
      parentNode,
      {obb, mbs: [1, 2, 3, 4]},
      [{metricType: 'metricType', maxError: 12345}],
      nodeInPage,
      emptyResources,
      getConverter()
    );
    st.ok(node instanceof NodeIndexDocument);
    st.equal(node.inPageId, 5);
    st.equal(node.id, '5');
    st.end();
  });

  t.end();
});
