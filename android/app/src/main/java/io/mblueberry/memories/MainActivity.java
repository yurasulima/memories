package io.mblueberry.memories;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        View root = getBridge().getWebView();

        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets statusBar = insets.getInsets(WindowInsetsCompat.Type.statusBars());

            // 👇 додаємо відступ зверху
            v.setPadding(0, 150, 0, 0);

            return insets;
        });
    }
}
