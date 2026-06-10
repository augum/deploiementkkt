package bdom.kikwit.web;

import bdom.kikwit.Dto.PersonnelRequestDto;
import bdom.kikwit.Dto.PersonnelResponseDto;
import bdom.kikwit.Services.PersonnalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Gestion des personnels", description = "La gestion des personnels des differentes structures")

public class PersonnelController {
    private PersonnalService service;

    @PostMapping(path = "/personnels")
    @Operation(summary = "Insertion des informations sur les personnels")
    public PersonnelResponseDto save(@RequestBody PersonnelRequestDto requestDto){
        return  service.save(requestDto);
    }
    @GetMapping(path = "/personnels")
    @Operation(summary = "Liste des toutes les informations des personnels des structures")
    public List<PersonnelResponseDto> list(){
        return service.getAll();
    }
    @PatchMapping(path = "/personnels/{id}")
    @Operation(summary = "Modifications d'une information sur les personnels des structures")
    public PersonnelResponseDto update(@PathVariable Long id, @RequestBody PersonnelRequestDto requestDto){
        return service.update(id,requestDto);
    }
    @DeleteMapping(path = "/personnels/{id}")
    @Operation(summary = "Supprimé un personnel")
    public String delete(@PathVariable Long id){
        return service.delete(id);
    }
}
