package me.antonioantonino.mobilecloudcomputing

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val textCount = this.findViewById<TextView>(R.id.txtCount)
        val textInput = this.findViewById<EditText>(R.id.textInput)

        this.findViewById<Button>(R.id.button).setOnClickListener {
            val numberOfWords = if (textInput.text.isEmpty()) 0 else textInput.text.split(" ").size
            textCount.text = String.format("Word Count is: %d", numberOfWords)
        }
    }
}
