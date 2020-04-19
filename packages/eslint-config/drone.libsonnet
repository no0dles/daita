{
    name: "eslint-config",
    depends_on: [],
   build: {
       commands: [
           'npm install',
           'npm run build'
       ]
   },
   test: {
       commands: [
           'npm test'
       ]
   }
}
