module.exports = {
    hooks: {
      readPackage(packageJson) {
        if (packageJson.name !== 'fdi') {
          if (packageJson.dependencies && packageJson.dependencies['prosemirror-model']) {
            packageJson.dependencies['prosemirror-model'] = '1.13.4';
          }
          if (packageJson.peerDependencies && packageJson.peerDependencies['prosemirror-model']) {
            packageJson.peerDependencies['prosemirror-model'] = '1.13.4';
          }
        }
        return packageJson;
      },
    },
  };
  