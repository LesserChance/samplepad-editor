# Public Directory
This directory holds all classes necessary for the main electron process.

**rendererApi**  
This directory holds all classes that expose all native node and electron APIs to the renderer process. It is expected that any access to electron apis would need to use remote.

**mainApi**  
This directory holds all classes that expose all native electron APIs to the main process. It is expected that any access to electron apis can be used directly.

**events**  
This directory holds all classes that expose channels for communication between the main and renderer processes