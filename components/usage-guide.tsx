<div className="space-y-4 bg-black/80 border border-green-500/30 rounded-md p-4">
  <h3 className="text-green-400 font-bold text-lg">GITHUB_TOKEN_SETUP</h3>
  
  <div className="space-y-3">
    <p className="text-green-300">To use this tool, you'll need a GitHub Fine-grained Personal Access Token with proper permissions:</p>
    
    <div className="bg-green-950/30 border border-green-500/20 p-3 rounded">
      <h4 className="text-green-400 font-bold mb-2">Fine-grained Token Generation Process:</h4>
      <ol className="list-decimal pl-5 space-y-2 text-green-300/90">
        <li>Go to GitHub.com → Your profile menu → Settings</li>
        <li>Scroll down to "Developer settings" in the left sidebar</li>
        <li>Select "Personal access tokens" → "Fine-grained tokens"</li>
        <li>Click "Generate new token"</li>
        <li>Give your token a descriptive name and set an expiration date</li>
        <li>Under "Repository access" select "Only select repositories" and choose your target repository</li>
        <li>In "Permissions" section, expand "Repository permissions"</li>
        <li>Find "Contents" and set it to <span className="text-green-200 font-bold">Read and write</span> access</li>
        <li>This is required to allow the token to create commits in your repository</li>
        <li>Click "Generate token"</li>
        <li>IMPORTANT: Copy the token immediately - you won't be able to see it again!</li>
      </ol>
    </div>
    
    <div className="bg-yellow-950/20 border border-yellow-500/20 p-3 rounded">
      <h4 className="text-yellow-400 font-bold mb-2">Security Advantage:</h4>
      <p className="text-yellow-300/90">
        Fine-grained personal access tokens are more secure than classic tokens because they:
      </p>
      <ul className="list-disc pl-5 text-yellow-300/90">
        <li>Allow access to specific repositories only</li>
        <li>Grant only the exact permissions needed (Contents: Read and write)</li>
        <li>Have mandatory expiration dates for better security</li>
      </ul>
    </div>
  </div>
</div> 