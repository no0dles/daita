{
   name: "core",
   depends_on: ["eslint-config"],
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
