# Voice control for USB traffic light (Cleware USB-Ampel)

- [Product](https://www.cleware-shop.de/USB-Ampel-EN)

## API

- UI: `http://localhost:8080/`
- API URL: `http://localhost:8080/swagger-ui/`

## Notes

Make sure you have `javax.usb.properties` file on you classpath with the following content:
```
javax.usb.services = org.usb4java.javax.Services
```

## TODO

- normal operation with FSM
- connect 2 traffic light 

