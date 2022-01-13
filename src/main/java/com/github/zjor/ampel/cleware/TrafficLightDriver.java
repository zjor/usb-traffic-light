package com.github.zjor.ampel.cleware;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import javax.usb.UsbControlIrp;
import javax.usb.UsbDevice;
import javax.usb.UsbDeviceDescriptor;
import javax.usb.UsbException;
import javax.usb.UsbHostManager;
import javax.usb.UsbHub;
import javax.usb.UsbServices;
import java.util.List;

/**
 * Provides low-level access to USB device
 */
@Slf4j
public class TrafficLightDriver {

    public static final short PRODUCT_ID = 0x8;
    public static final short VENDOR_ID = 0xd50;

    public static final byte VALUE_ON = 0x1;
    public static final byte VALUE_OFF = 0x0;

    public static final byte COLOR_RED = 0x10;
    public static final byte COLOR_YELLOW = 0x11;
    public static final byte COLOR_GREEN = 0x12;

    private UsbDevice device;

    @Getter
    private boolean initialized = false;

    public void init() {
        try {
            final UsbServices services = UsbHostManager.getUsbServices();
            device = find(services.getRootUsbHub());
            if (device == null) {
                log.error("Cleware USB-Ampel was not found");
                throw new RuntimeException("Cleware USB-Ampel was not found");
            }
            initialized = true;
        } catch (UsbException e) {
            log.error("USB-Ampel init failed: " + e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private boolean isClewareAmpel(UsbDevice device) {
        final UsbDeviceDescriptor descriptor = device.getUsbDeviceDescriptor();
        short productId = descriptor.idProduct();
        short vendorId = descriptor.idVendor();
        return productId == PRODUCT_ID && vendorId == VENDOR_ID;
    }

    private UsbDevice find(UsbDevice parent) {
        if (parent.isUsbHub()) {
            for (UsbDevice child : (List<UsbDevice>) ((UsbHub) parent).getAttachedUsbDevices()) {
                UsbDevice ampel = find(child);
                if (ampel != null) {
                    return ampel;
                }
            }
        } else {
            if (isClewareAmpel(parent)) {
                return parent;
            }
        }
        return null;
    }

    protected void write(byte color, byte value) {
        if (!initialized) {
            log.error("TrafficLightDriver is not initialized");
            throw new IllegalStateException("not initialized");
        }
        UsbControlIrp irp = device.createUsbControlIrp((byte) 0x21, (byte) 0x09, (short) 0x200, (short) 0x00);
        irp.setData(new byte[]{0x00, color, value});
        try {
            device.syncSubmit(irp);
        } catch (UsbException e) {
            log.error("USB-Ampel write failed: " + e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    protected void write(byte color, boolean isEnabled) {
        write(color, isEnabled ? VALUE_ON : VALUE_OFF);
    }

}
